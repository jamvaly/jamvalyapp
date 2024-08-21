import { ReactTyped } from "react-typed";

const WelcomeText = () => (
  <div className="mb-2 mt-14">
    <ReactTyped className="w-36 font-sharp text-large"
       strings={[
        'Welcome to Jamvaly Hotel',
        'Barka da zuwa Jamvaly Hotel',
        ]} 
        typeSpeed={60}
        backSpeed={20}
        loop
        
         />
  </div>
);
export default WelcomeText;