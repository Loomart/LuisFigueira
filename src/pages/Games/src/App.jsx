import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ShapeSorter from './ShapeSorter';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route  path="/games">
          <Games   />
        </Route>
        <Route  path="/">
          <Home   />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;