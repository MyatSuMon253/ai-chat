import ReviewList from './components/reviews/ReviewList';
import 'react-loading-skeleton/dist/skeleton.css';

function App() {
   return (
      <div className="p-4 h-screen w-full">
         <ReviewList productId={1} />
      </div>
   );
}

export default App;
