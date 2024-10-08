import { useState } from 'react';
import './App.css';
import FormSection from './FormSection';
import PlantList from './PlantList';

function App() {
    const [plants, setPlants] = useState(null);
    const [message, setMessage] = useState(null);

    return (
        <div className="container">
            <FormSection setPlants={setPlants} setMessage={setMessage} />
            <PlantList plants={plants} message={message} />
        </div>
    );
}

export default App;
