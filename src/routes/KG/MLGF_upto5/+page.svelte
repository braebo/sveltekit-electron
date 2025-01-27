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
<ol id="start">
	<h1>
	  One More, One Less, Fewer, and More!
	</h1>
	<br />
  <div class="container math">
	<!-- One More -->
	<p>This is one pizza.</p>
	<img alt="pizza" height="45" src={pizza} />
	<p>Now, one more pizza.</p>
	<img alt="pizza" height="45" src={pizza} /><img alt="pizza" height="45" src={pizza} />
	<p>How many pizzas are there now?</p>
	<p>Answer: 2 pizzas</p>
  </div>
  <div class="container science">
	<!-- One Less -->
	<p>This is three frogs.</p>
	<img alt="frog" height="45" src={frog} />
	<img alt="frog" height="45" src={frog} />
	<img alt="frog" height="45" src={frog} />
	<p>If we take one less frog, we have:</p>
	<img alt="frog" height="45" src={frog} />
	<img alt="frog" height="45" src={frog} />
	<p>How many frogs are left? - 2 frogs</p>
</div>
<div class="container ss">
	<!-- Fewer -->
	<p>This is five pizzas.</p>
	<img alt="pizza" height="45" src={pizza} />
	<img alt="pizza" height="45" src={pizza} />
	<img alt="pizza" height="45" src={pizza} />
	<img alt="pizza" height="45" src={pizza} />
	<img alt="pizza" height="45" src={pizza} />
	<p>If we have fewer pizzas, we take pizzas away.</p>
	<img alt="pizza" height="45" src={pizza} />
	<img alt="pizza" height="45" src={pizza} />
	<p>How many pizzas do we have now? - 2 pizzas</p>
	<p>Three pizzas were taken away.</p>
</div>
<div class="container english">
	<!-- Greater -->
	<p>This is two frogs.</p>
	<img alt="frog" height="45" src={frog} />
	<img alt="frog" height="45" src={frog} />
	<p>If we have greater frogs, there are more frogs.</p>
	<img alt="frog" height="45" src={frog} />
	<img alt="frog" height="45" src={frog} />
	<img alt="frog" height="45" src={frog} />
	<img alt="frog" height="45" src={frog} />
	<img alt="frog" height="45" src={frog} />
	<p>How many frogs do we have now?</p>
	<p>Answer: 5 frogs</p>
</div>
	<button
	  on:click={() => location.replace('x.com')}
	  class="btn btn-success"
	>
	  Continue&nbsp;&nbsp;
	  <i class="fas fa-arrow-right" />
	</button>  
	<style>

		ol {
			padding: 0px;
		}
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
			overflow-y: visible;
			margin-top: 90px;
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
			text-align: center;
		}


		/* Container styles */
		.container {
			border-radius: 5px;
			margin-bottom: 20px;
			box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
			padding: 10px 20px;
		}

		.science {
			background-color: #90ee90;
			box-shadow: 0 0 50px #90ee90;
			border-radius: 20px;
			overflow: hidden;
		}

		.ss {
			background-color: #fbdf71;
			box-shadow: 0 0 50px #fbdf71;
			border-radius: 20px;
			overflow: hidden;
		}

		.english {
			background-color: #ffb6c1;
			box-shadow: 0 0 50px #ffb6c1;
			border-radius: 20px;
			overflow: hidden;
		}

		.math {
			background-color: #add8e6;
			box-shadow: 0 0 50px #add8e6;
			border-radius: 20px;
			overflow: hidden;
		}
		p {
			margin-bottom: 0px;
		}
	</style>
</ol>
