<script>
    import "./styles.css";
    import LearnQuest_logo from "$lib/LearnQuest_logo.png";
    import { Button, Col, Row } from "@sveltestrap/sveltestrap";
</script>
  <div class="wrapper">
    <div class="form-wrapper sign-in">
      <form action="">
        <h2>Login</h2>
        <div class="input-group">
          <input type="text" required>
          <label for="">Username</label>
        </div>
        <div class="input-group">
          <input type="password" required>
          <label for="">Password</label>
        </div>
        <div class="remember">
          <label><input type="checkbox"> Remember me</label>
        </div>
        <button type="submit">Login</button>
        <div class="signUp-link">
          <p>Don't have an account? <a href="/signup/" class="signUpBtn-link">Sign Up</a></p>
        </div>
      </form>
    </div>
  </div>