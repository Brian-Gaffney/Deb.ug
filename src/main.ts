import App from './App.svelte';

const app = new App({
	target: document.body,

	// Trigger initial animations
	intro: true,
});

export default app;