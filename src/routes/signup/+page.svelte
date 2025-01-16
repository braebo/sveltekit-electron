<script>
    import "$si/styles.css";
    import LearnQuest_logo from "$lib/LearnQuest_logo.png";
    import { Button, Col, Row } from "@sveltestrap/sveltestrap";
</script>
    <div class="form-wrapper sign-in">
      <form action="">
        <h2>Sign Up</h2>
        <div class="input-group">
          <input type="text" required>
          <label for="">Username</label>
        </div>
        <div class="input-group">
          <input type="email" required>
          <label for="">Email</label>
        </div>
        <div class="input-group">
          <input type="password" required>
          <label for="">Password</label>
        </div>
        <div class="remember">
          <label><input type="checkbox"> I agree to the terms & conditions</label>
        </div>
        <button type="submit">Sign Up</button>
        <div class="signUp-link">
          <p>Already have an account? <a href="/signin/" class="signInBtn-link">Sign In</a></p>
        </div>
      </form>
    </div>