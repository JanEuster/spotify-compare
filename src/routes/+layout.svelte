<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
	<link
		href="https://fonts.googleapis.com/css2?family=Bungee&family=Rubik+Mono+One&family=Titan+One&family=VT323&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<slot />

<style lang="scss">
	:root {
		--c-background: #121212;

		--c-green-100: rgb(29, 215, 94);
		--c-green-80: rgba(29, 215, 94, 0.8);
		--c-green-60: hsla(141, 76%, 48%, 0.6);
		--c-green-40: rgba(29, 215, 94, 0.4);
		--c-green-20: rgba(29, 215, 94, 0.2);

		--c-white: white;
		--c-offwhite: rgb(228, 228, 228);
		--c-grey: rgb(179, 179, 179);
		--c-text: var(--c-white);
	}
	:global(*, *::before, *:after) {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}
	:global(body) {
		background-color: black;
		color: var(--c-text);
		font-family: 'Bungee', sans-serif;
	}
	:global(button, input) {
		font-family: 'VT323', sans-serif;
		font-size: 24px;
		cursor: pointer;
		opacity: 0.8;
	}
	:global(button:hover, input:hover) {
		opacity: 1;
	}
	:global(h1, h2, h3) {
		font-family: 'VT323';
	}
	:global(h4, h5, h6) {
		font-family: 'Rubik Mono One';
	}
	:global(a) {
		color: var(--c-green-100);
		text-decoration: none;
		&:hover {
			text-decoration: underline dashed;
		}
	}
	:global(p) {
		line-height: 1;
	}
</style>
