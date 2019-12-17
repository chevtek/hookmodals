# React Hook Modals

The future of modals in React.

- No need to wrap the root of your entire app in some kind of provider.
- A clean separation of logic means your components don't even have to know they are modals!

## How to install

```bash
$ npm i @chevtek/hookmodals
```

## TypeScript

This module is written in TypeScript and comes with type declarations already.

## Getting Started

First pull in the `useModalProvider` hook and give it an object whose keys are the names of your modals. Then assign each modal a resolver function that will return a component you would like to turn into a modal.

The hook will provide you with a `ModalContainer` component that you can place anywhere you wish. It provides a place for active modals to render themselves.

> Note: You will still need to style your modal components to make them appear over the top of your page. I recommend something like [Bootstrap Modals](https://getbootstrap.com/docs/4.0/components/modal/).

```jsx
// App.jsx

import { useModalProvider } from "@chevtek/hookmodals";

const modals = {
  loginForm: () => <LoginModal />
};

const MyApp = () => {
  const ModalContainer = useModalProvider(modals);
  return (
    <Home />
    <ModalContainer />
  )
};
```

To use your modal simply import the `useModals` hook anywhere else in your app.

```jsx
// Home.jsx

import { useModals } from "@chevtek/hookmodals";

const Home = () => {
  const { loginForm } = useModals();

  const loginClick = () => {
    loginForm.open();
  };

  return (
    <div>
      <button onClick={loginClick}>Sign In</button>
    </div>
  );
};
```

And that's it! But that's not all you can do.

## Need options?

Your modal resolver functions can accept custom options. Just pass them in as props!

```jsx
// App.jsx

const modals = {
  successMessage: ({ title, description }) =>
    <SuccessModal title={title} description={description} />
};
```

```jsx
// SomeComponent.jsx

const SomeComponent = () => {
  const { successMessage } = useModals();

  const showSuccess = () => {
    successMessage.open({
      title: "Login Successful",
      message: "You are now authenticated and may continue."
    });
  };

  return (
    <button onClick={showSuccess}>Show Success Modal</button>
  );
}
```

## Need more control?

Your modal component doesn't need to do anything else to be controlled by hookmodals. However, what if your modal wants to close itself? Your resolver function receives its own modal controller as a second argument. A modal controller contains helper methods, such as `open` and `close` for controlling your modal.

```jsx
// App.jsx

const modals = {
  login: (options, { close }) => <Login close={close} />
};
```

```jsx
// Login.jsx

const Login = ({ close }) => {
  return (
    <button onClick={close}>Close Me</button>
  )
};
```

## Want to open one modal from another?

Your resolver functions receive a third and final argument, the modal controllers object returned from the `useModals` hook.

```jsx
// App.jsx

const modals = {
  step1: (options, close, { step2 }) => (
    <WizardStep1 close={close} next={step2.open} />
  ),
  step2: (options, close, { step1, step3 }) => (
    <WizardStep2 close={close} prev={step1.open} next={step3.open} />
  ),
  step3: (options, close, { step2 }) => (
    <WizardStep3 close={close} prev={step2.open} />
  )
};
```

You can see above how we retrieve specific modal controllers from the third argument passed to our resolver functions.

```jsx
// WizardStep2.jsx

const WizardStep2 = ({ close, next, prev }) => {

  const nextClick = () => {
    close();
    next();
  };

  const prevClick = () => {
    close();
    prev();
  }

  return (
    <div>
      <h1>Step 1</h1>
      <button onClick={close}>Cancel</button>
      <button onClick={prevClick}>Prev</button>
      <button onClick={nextClick}>Next</button>
    </div>
  );
};
```

> Note: You'll notice here that we call `close` and then `next` or `prev`. Hookmodals allows you to have as many modals active as you wish. The traditional modal that floats over everything in the center of the page might not make sense to have more than one open at a time. However there are some cool architectures out there that cleverly make use of multiple toggled modal-like elements and we didn't want to limit your options.

## Want to know when a modal closes?

The `open` method returns a promise that resolves on close. If `close` is passed a value then that promise will resolve with that value. There is also an `error` method which functions the same as `close` except it will reject the promise created when the modal was opened. If `error` is passed a value such as an `Error`, then the promise is rejected with that value.

```jsx
// App.jsx

const modals = {
  registerModal: () => <RegisterModal />,
  successModal: ({ title, message }) => (
    <SuccessModal title={title} message={message} />
  ),
  errorModal: ({ title, err }) => (
    <ErrorModal title={title} err={err} />
  )
};
```

```jsx
// Home.jsx

const Home = () => {
  const { registerModal, successModal, errorModal } = useModals();

  const beginRegistration = async () => {
    try {
      const username = await registerModal.open();
      successModal.open({
        title: `Welcome, ${username}!`,
        message: "Your registration was successful!"
      });
    } catch (err) {
      errorModal.open({
        title: "An error has occurred!",
        err
      });
    }
  };

  render (
    <div>
      <button onClick={beginRegistration}>Sign Up!</button>
    </div>
  );
};
```

Notice how we open the `registerModal` and `await` for the returned promise to resolve. If it resolves successfully then we know the modal was closed without errors and we can open our success modal. In this case the modal also resolves a `username` value which we pass into the success modal to be displayed in the title.

We also wrap that little promise chain in a `try/catch`. If there is a problem with registration while the modal is open, the modal can use the `error` method on its controller to reject the promise returned from `open`. Once rejected, our `catch` handler will fire and give us the error value. In this example we pass that error and a message into an `errorModal`.

The flexibility of this promise-based API allows you to open your modals from anywhere, even in the middle of a large promise chain in some service elsewhere in your app. Want to allow your users to add tracks to a playlist on their Spotify account? What if you send the track IDs to your back-end API and realize they don't have a playlist created to add the tracks to? Pop open a modal! Let the user interact with the modal to create a new playlist. When the modal closes then continue your promise chain!

```js
// myApi.service.js

export class MyApiService {

  constructor(modals) {
    this.modals = modals;
  }

  async addTracksToUserPlaylist(trackURIs) {
    try {
      const { modals } = this;

      const hasPlaylist = await fetch("/api/user-has-playlist");

      let playlistId, playlistName;
      if (!hasPlaylist) {
        [playlistId, playlistName] = await modals.createPlaylist.open();
      } else {
        [playlistId, playlistName] = await modals.choosePlaylist.open();
      }

      if (!playlistId) {
        throw new Error("No Spotify Playlist ID");
      }

      await fetch(`/api/add-tracks-to-playlist/${playlistId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tracks: trackURIs
        })
      });

      modals.success.open({
        title: "Success!",
        message: `${trackURIs.length} tracks successfully added to playlist ${playlistName}.`
      });
    } catch (err) {
      modals.error.open({
        title: "An Error Occurred",
        err
      });
    }
  }
}
```

## Credits

Authored by [Chev](https://github.com/chevtek).

Inspired by [Paratron's React Hook Router](https://github.com/Paratron/hookrouter).
