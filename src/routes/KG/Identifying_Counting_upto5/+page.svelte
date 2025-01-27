<script>
	import pizza from '$lib/pizza.png';
	import frog from '$lib/frog.png';
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
	/>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
	/>
</svelte:head>
<ol>
	<h1>
		Indentifying/Counting
		<br />
		 Numbers (up to 5)
	</h1>
	<br />
	<p>This is one pizza.</p>
	<img alt="pizza" height="45" src={pizza} />
	<p>These are two frogs.</p>
	<img alt="frog" height="45" src={frog} />
	<img alt="frog" height="45" src={frog} />
	<p>These are three pizzas.</p>
	<img alt="pizza" height="45" src={pizza} />
	<img alt="pizza" height="45" src={pizza} />
	<img alt="pizza" height="45" src={pizza} />
	<p>These are four frogs.</p>
	<img alt="frog" height="45" src={frog} />
	<img alt="frog" height="45" src={frog} />
	<img alt="frog" height="45" src={frog} />
	<img alt="frog" height="45" src={frog} />
	<p>These are five pizzas.</p>
	<img alt="pizza" height="45" src={pizza} />
	<img alt="pizza" height="45" src={pizza} />
	<img alt="pizza" height="45" src={pizza} />
	<img alt="pizza" height="45" src={pizza} />
	<img alt="pizza" height="45" src={pizza} />
	<br />
	<br />
	<button
		on:click={() => location.replace('../Indentifying_Counting_upto5.html')}
		class="btn btn-success"
	>
		Continue&nbsp;&nbsp;
		<i class="fas fa-arrow-right" />
	</button>
	<!--MAKE LINK & STYLE-->
	<!--MAKE LINK & STYLE-->
	<style>
		@import 'https://fonts.googleapis.com/css2?family=Poppins&display=swap';

		* {
			margin: 0;
			padding: 0;
		}

		html,
		body {
			display: flex;
			justify-content: center;
			align-items: center;
			font-family: 'Poppins';
			font-size: 1rem;
			line-height: 2;
			height: 100%;
			background-color: #221;
		}

		a {
			text-decoration: none;
			color: #add8e6;
			padding: 0px 5px;
		}

		li {
			color: #4faf44;
		}

		.arrow i {
			display: none;
		}

		.arrow {
			position: relative;
			display: block;
			color: #add8e6;
			border-radius: 8px;
		}

		.arrow:hover {
			cursor: pointer;
			background-color: rgba(236, 152, 56, 0.2);
		}

		.arrow:hover i {
			display: block;
			position: absolute;
			top: 0.5em;
			left: -3em;
		}

		h1 {
			color: white;
			margin-right: 30px;
			text-align: center;
		}

		p,
		blockquote {
			color: white;
		}
	</style>
</ol>
