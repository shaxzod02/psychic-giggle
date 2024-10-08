import { useState } from 'react';

const FormSection = ({ setPlants, setMessage }) => {
    const [formData, setFormData] = useState({
        edible: '',
        pets_kids: '',
        lifespan: '',
        water_schedule: '',
        sunlight: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]]; // swap elements
      }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        const params = new URLSearchParams(
          Object.entries(formData).filter(([key, value]) => value !== '')
      ).toString();
        const apiUrl = `https://perenual.com/api/species-list?key=${import.meta.env.VITE_PERENUAL_API_KEY}&indoor=1&${params}`;

        try {
            console.log(params)
            const response = await fetch(apiUrl);
            const data = await response.json();
            const validData = data.data.filter(item =>
                !(item.cycle.includes("Upgrade") ||
                    item.watering.includes("Upgrade") ||
                    item.sunlight.includes("Upgrade"))
            );

            console.log(validData)

            if (validData && validData.length > 0) {
                shuffleArray(validData)
                setPlants(validData.slice(0, 3));
                setMessage(null);
            } else {
                setPlants([]);
                console.log('no result')
                setMessage("No results returned, please modify your selection and try again.");
            }
        } catch (error) {
            console.error('Error:', error);
            setPlants([]);
            setMessage("Internal Server Error");
        }
    };

    return (
        <div className="form-section">
            <h1>Greener Thumb</h1>
            <h2>Murder Fewer Houseplants...maybe</h2>
            <form id="plant-form" onSubmit={handleSubmit}>
                {['edible', 'pets_kids', 'lifespan', 'water_schedule', 'sunlight'].map((field, index) => (
                    <div className="question" key={index}>
                        <label htmlFor={field}>{field === 'pets_kids' ? 'PETS OR KIDS' : field.replace('_', ' ').toUpperCase()}</label>
                        <select name={field} id={field} value={formData[field]} onChange={handleChange}>
                            <option value="">No preference</option>
                            {/* Other options */}
                            {field === 'edible' && <>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </>}
                            {field === 'pets_kids' && <>
                                <option value="0">Yes</option>
                                <option value="1">No</option>
                            </>}
                            {field === 'lifespan' && <>
                                <option value="perennial">Preferably forever - perennial</option>
                                <option value="annual">I'm here for a fun time, not a long time - annual</option>
                            </>}
                            {field === 'water_schedule' && <>
                                <option value="frequent">Yes - I have a regular schedule</option>
                                <option value="average">Yes - every so often</option>
                                <option value="minimum">Maybe - if I remember, but don't count on it...</option>
                            </>}
                            {field === 'sunlight' && <>
                                <option value="full_sun">Full sun!</option>
                                <option value="full_shade">All shade, all the time</option>
                                <option value="part_shade">Equal parts sun and shade (or I dunno...)</option>
                            </>}
                        </select>
                    </div>
                ))}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default FormSection;
