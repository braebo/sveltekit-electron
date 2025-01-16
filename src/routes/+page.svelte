<svelte:head>
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"/>
</svelte:head>
<section class="">
    <!-- Main content -->
    <div class="main" id="main-content">
        <!-- Header -->
        <div class="header">
            <h1>Welcome to LearnQuest</h1>
            <h3>LearnQuest: Ignite Curiosity, Achieve Excellence</h3>
            <p>
                Check our our latest review activities for our libraries,
                consisting of leassons from grades K-5.
            </p>
        </div>

        <div class="container math" id="home">
            <h3>
                <pre class="material-icons" 
                    style="font-size:29px; vertical-align: middle; margin-right: 5px">calculate</pre>
                Math<span class="quest"> Quests</span>
            </h3>
            <button on:click={() => location.replace("/KG/")} class="btn btn-danger">KG</button>
            <a href="Math_1st.html"><button class="btn btn-success">1st Grade</button></a>
            <a href="Math_2nd.html"><button style="color: white" class="btn btn-warning">2nd Grade</button></a>
            <a href="Math_3rd.html"><button style="color: white;" class="btn btn-info">3rd Grade</button></a>
            <a href="Math_4th.html"><button style="background-color: #ff69b4; border: #ff69b4" class="btn">4th Grade</button></a>
            <a href="Math_5th.html"><button class="btn btn-primary">5th Grade</button></a>

        </div>

        <div class="container english" id="services">
            <h3>
                <pre class="material-icons" style="font-size:29px; vertical-align: middle; margin-right: 5px">menu_book</pre>English<span class="quest">Quests</span>
            </h3>
        </div>

        <div class="container ss" id="home">
            <h3>
                <pre
                    class="material-icons"
                    style="font-size:29px; vertical-align: middle; margin-right: 5px">history_edu</pre>
                Social Studies<span class="quest">Quests</span>
            </h3>
        </div>

        <div class="container science" id="services">
            <h3>
                <pre
                    class="material-icons"
                    style="font-size:29px; vertical-align: middle; margin-right: 5px">science</pre>
                Science<span class="quest">Quests</span>
            </h3>
        </div>
    </div>
    <style>
        body {
            font-family: "Varela Round", sans-serif; /* Set font to Varela Round */
            background-color: black;
            display: flex;
            transition: margin-left 0.3s;
            text-align: center;
            align-items: center;
            width: 100%;
            justify-content:center;
        }
        
        h1 {
            font-family: "Poppins", sans-serif; /* Title uses Poppins */
            color: #ec9838; /* Dark purple color for title */
        }
        
        h2 {
            font-family: "Varela Round", sans-serif; /* Subheadings use Varela Round */
            color: #ec9838; /* Dark purple color for headings */
        }
        
        p, h3 {
            color: white;
        }
        /* Sidebar styles */
        .sidebar {
            width: 250px;
            background-color: black; /* Change color if needed */
            padding: 15px;
            color: white;
            height: 100vh;
            position: fixed;
            left: -250px; /* Hide initially */
            transition: left 0.3s;
        }
        
        .sidebar h2 {
            font-size: 24px;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .sidebar a {
            color: black;
            text-decoration: none;
            display: block;
            padding: 10px;
            margin: 5px 0;
            transition: background-color 0.3s;
        }
        
        .sidebar a:hover {
            background-color: #ec9838; /* Lighter purple on hover */
        }
        
        /* Main content styles */
        .main {
            margin-left: 0; /* Adjust based on sidebar visibility */
            padding: 20px;
            width: calc(100% - 0);
            transition: margin-left 0.3s;
        }
        
        /* Container styles */
        .container {
            border-radius: 5px;
            margin-bottom: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
        }
        
        .science { 
            background-color: #90EE90;
            box-shadow: 0 0 50px #90EE90;
            border-radius: 20px;
            overflow: hidden;
        }
        
        .ss {
            background-color: #FBDF71;
            box-shadow: 0 0 50px #FBDF71;
            border-radius: 20px;
            overflow: hidden;
        }
        
        .english {
            background-color: #FFB6C1;
            box-shadow: 0 0 50px #FFB6C1;
            border-radius: 20px;
            overflow: hidden;
        }
        
        .math {
            background-color: #ADD8E6;
            box-shadow: 0 0 50px #ADD8E6;
            border-radius: 20px;
            overflow: hidden;
        }
        
        /* Menu button */
        #menu-btn {
            font-size: 24px;
            cursor: pointer;
            position: fixed;
            left: 10px;
            top: 10px;
            z-index: 2;
            color: white; /* Color of the menu icon */
        }
        
        .logo {
            width: 250px;
            
        }
        
        .quest::first-letter {
            text-decoration: none;
        }
        
        .quest {
            font-style: oblique;
            margin-left: 3px;
            text-decoration: underline;
        }
        
        .grade-list-container {
            margin: 10px 15px;
            background-color: #F5F5F5;
            padding: 10px;
            border-radius: 5px;
            display: flex;
            flex-wrap: nowrap;
            gap: 10px;
            justify-content: center;
        }
        
        .link {
            text-decoration: none;
        }
        
        .grade-item {
            padding: 5px;
            border-radius: 3px;
            display: inline-block;
            color: white;
        }
    </style>
</section>