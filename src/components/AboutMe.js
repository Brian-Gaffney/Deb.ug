import { h } from "preact";
import injectSheet from "react-jss";

const styles = {
  list: {
    marginTop: "1em"
  }
};

const AboutMe = ({ classes }) => {
  return (
    <div className={classes.component}>
      <h1>Brian Gaffney</h1>

      <h2>JS developer in Melbourne, Australia.</h2>

      <p>
        I like building single page apps, good user interfaces and clearly
        conveying information.
      </p>

      <ul className={classes.list}>
        <li>
          <a href="mailto:brian@deb.ug">brian@deb.ug</a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://www.linkedin.com/in/brian-gaffney-80760a42/"
          >
            LinkedIn
          </a>
        </li>
        <li>
          <a target="_blank" href="https://github.com/Brian-Gaffney">
            Github
          </a>
        </li>
        <li>
          <a target="_blank" href="https://gitlab.com/briangaffney">
            Gitlab
          </a>
        </li>
        <li>
          <a target="_blank" href="tel:+61407668336">
            +61 407 668 336
          </a>
        </li>
      </ul>
    </div>
  );
};

export default injectSheet(styles)(AboutMe);
