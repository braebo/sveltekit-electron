<title>Anee's Care LLC</title>
<!-- Add your meta tags, stylesheets, and fonts links here -->
<link href="https://fonts.googleapis.com/css?family=Pacifico" rel="stylesheet" />
<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
	rel="stylesheet"
	integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
	crossorigin="anonymous"
/>
<link
	rel="stylesheet"
	href="https://fonts.googleapis.com/css?family=Varela+Round&amp;display=swap"
/>
<link
	href="https://fonts.googleapis.com/css2?family=Poppins:wght@500&amp;display=swap"
	rel="stylesheet"
/>
<!-- Phone numbers and navigation container -->

<!-- Header -->
<div class="header">
	<div class="bg-text">
		<div class="section-background parallax">
			<!-- Add a div for the parallax effect -->
			<br />
			<br />
			<h1>
				Welcome to <img
					width="300px"
					src="./LearnQuest_Custom.png"
					alt="LearnQuest Custom"
				/>
			</h1>
		</div>
	</div>
</div>
<br />
<!-- Containers -->

<div class="container" id="home">
	<h2>Enter Your LearnQuest Activity Code</h2>
	<p>Please enter the custom code provided by your teacher to access the activity.</p>
	<form class="d-flex align-items-center" id="codeForm">
		<input style="width: 150px; background: #dee2e6; border: 3px gray solid; border-radius: 10px;" type="text" class="form-control" placeholder="Code" id="codeInput" required />
		<button type="submit" style="margin-left: 10px; width: 35px; height: 35px; border-radius: 50%; background-color: #198754; border: none; color: white; display: flex; justify-content: center; align-items: center;">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
				<path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
			</svg>
		</button>
	</form>
	<div id="warning" style="color:red; margin-left: 10px; margin-top: 3px;"><span><img src="" alt=""></span>
	</div>
	
	<!-- Link to external JS file -->
	<script src="./formScript.js"></script>
</div>

<div style="margin-top: 20px;" class="container" id="home">
	<h2>Create A LearnQuest Activity</h2>
	<p>Click below to create your very own, customizable LearnQuest activity for anyone to use! Please note that you must need a Discord account before proceeding to create a LearnQuest activity.</p>
	<button onclick="window.location.href='./customizable-quests/questmaker/'" class="btn btn-success">Create Now</button>
	
</div>
<style>
	/* Reset some default styles */

	/* Container styles */
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
		background-color: #c8aeb9;
		border-radius: 5px;
		transition: transform 0.5s ease-in-out;
	}

	.container h2,
	.container p {
		font-family: 'Varela Round', sans-serif;
	}

	.container h2 {
		font-size: 24px;
		color: purple;
	}

	.container p {
		font-size: 16px;
		line-height: 1.6;
	}

	.section-background {
		background-attachment: fixed;
		background-position: center;
		background-size: cover;
		height: 40vh;
		width: 100%;
		text-align: center;
	}

	.parallax {
		background-image: url('background.png');
	}
</style>
