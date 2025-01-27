<script>
  import { onMount } from 'svelte';

  // Declare the form object with the necessary fields
  let form = {
    name: '',
    mode: '',
    questions: [
      {
        question: '',
        answers: ['', ''],
      },
    ],
  };

  let isSubmitting = false;

  // Form submission handler
  async function handleSubmit(event) {
    event.preventDefault();

    isSubmitting = true;

    const response = await fetch('/api/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    const result = await response.json();

    if (result.success) {
      alert('Quest submitted successfully!');
    } else {
      alert('There was an error submitting the quest.');
    }

    isSubmitting = false;
  }

  // Add more questions
  function addMoreQuestions() {
    if (form.questions.length < 10) {
      form.questions.push({
        question: '',
        answers: ['', ''],
      });
    } else {
      alert('You can add a maximum of 10 questions.');
    }
  }

  // Function to remove a question
  function removeQuestion(index) {
    form.questions.splice(index, 1);
  }
</script>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quest Maker</title>
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    .required::after {
      content: " *";
      color: red;
    }
    .optional {
      color: grey;
      font-size: 0.85em;
    }
    .optional-input {
      background-color: #f8f9fa;
    }
    .required-input {
      border: 2px solid red;
    }
    .tooltip-inner {
      max-width: 250px;
    }
  </style>
</head>
<body>
  <div class="container mt-5">
    <h2 class="mb-4">Create Your Quest</h2>
    <form id="QuestForm" on:submit|preventDefault={handleSubmit}>
      <!-- Mode Selection Question -->
      <div class="mb-3">
        <label for="mode" class="form-label required">Select Quest Mode</label>
        <select class="form-select required-input" bind:value={form.mode} required>
          <option value="">-- Select a Mode --</option>
          <option value="questrunner">QuestRunner (Game)</option>
          <option value="regular">Regular Quest (Not a Game)</option>
          <option value="timed">Timed Quest (Not a Game)</option>
        </select>
      </div>

      <!-- User Name Input -->
      <div class="mb-3">
        <label for="name" class="form-label required">Your Name</label>
        <input type="text" class="form-control required-input" bind:value={form.name} placeholder="Enter your name" required>
      </div>

      <!-- Loop through questions array and display each question -->
      {#each form.questions as question, index (index)}
        <div class="mb-3 question" id={"question" + index}>
          <label for={"question" + index + "Text"} class="form-label required">Question {index + 1}</label>
          <input type="text" class="form-control required-input" bind:value={question.question} placeholder="Enter the question" required>
          <button type="button" class="btn btn-danger btn-sm mt-2" on:click={() => removeQuestion(index)}>Remove Question</button>

          <div class="mb-3" id={"answers" + index}>
            <label class="form-label required" data-bs-toggle="tooltip" title="Answer A and Answer B are required.">Answer Choices</label>
            <div class="input-group mb-2">
              <input type="text" class="form-control required-input" bind:value={question.answers[0]} placeholder="Enter Answer A" required>
            </div>
            <div class="input-group mb-2">
              <input type="text" class="form-control required-input" bind:value={question.answers[1]} placeholder="Enter Answer B" required>
            </div>
            <div class="input-group mb-2 optional-input">
              <input type="text" class="form-control" bind:value={question.answers[2]} placeholder="Enter Answer C">
              <small class="optional">Optional</small>
            </div>
            <div class="input-group mb-2 optional-input">
              <input type="text" class="form-control" bind:value={question.answers[3]} placeholder="Enter Answer D">
              <small class="optional">Optional</small>
            </div>
          </div>
        </div>
      {/each}

      <!-- Add More Questions Button -->
      <button type="button" class="btn btn-secondary mb-3" on:click={addMoreQuestions}>Add More Questions</button>

      <!-- Submit Button -->
      <button type="submit" class="btn btn-primary mb-3" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Quest'}
      </button>
    </form>
  </div>

  <!-- Bootstrap JS and Popper -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
