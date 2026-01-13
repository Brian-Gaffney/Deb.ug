<script lang="ts">
	import { Router, Route } from 'svelte-routing'
	import HomePage from './components/HomePage.svelte'
	import AnacondaGame from './components/AnacondaGame.svelte'
	import AboutPage from './components/AboutPage.svelte'
</script>

<Router>
	<Route path="/anaconda" component={AnacondaGame} />
	<Route path="/about" component={AboutPage} />
	<Route path="/" component={HomePage} />
</Router>
