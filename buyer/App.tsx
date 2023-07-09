
import Container from './contain';
import { Provider } from 'react-redux';
import { Store } from './redux/store';

export default function App() {

  return (
    <Provider store={Store}> 
      <Container/>
    </Provider>
   
  );
}
