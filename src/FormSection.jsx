import { useState } from "react";


const FormSection = ({setPlants, setMessage }) => {
    const [ formDate, setFormDate ] = useState({
        edible: '',
        pets_kids: '',
        lifespan: '',
        water_schedule: '',
        sunlight: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormDate({
            ...formDate,
            [name]: value
        })
    }

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    const handleSubmit = async  (e) => {
        e.preventDefault();
        const params = new URLSearchParams()
        const apiUrl = `https://perenul.com/api.species-list?key=${import.meta.env.
            VITE_PERENUAL_API_KEY}&indoor=18${params}`;

          try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const validData = data.data.filter(item => 
                !(item.cycle.includes('Upgrade') ||
                 item.watering.includes('Upgrade') || 
                item.sunlight.includes('Upgrade'))
            );

            if (validData && validData.length > 0) {
               shuffleArray(validData)
               setPlants(validData.slice(0,3))
                setMessage(null)
            }else{
                setPlants([])
                setMessage('No results returned, please modify your selection and try again.')
            }

            } catch (error) {
                console.error('Error:', error)
                setPlants([])
                setMessage('Internal Server Error')
            }
               
          
    }   

    return (
        <div className="form-section">
            <h1>Greener Thunb</h1>
            <h2>Murder Fewer Houseplants...maybe</h2>
            <form id="pl" onSubmit={handleSubmit}>
             {[ 'edible: ',' pets_kids: ',' lifespan: ',' water_schedule: ',' sunlight:' ].map((field,
                index) => (
                    <div className="question" key={index}>
                        <label htmlFor={field}>{field === 'pets_kids' ? 'PETS OR KIDS' : 
                        field.replace('_', '').toUpperCase}</label>
                        <select name={field}id={field} value={formDate[field]} onChange=
                        {handleChange}>
                         <option value="">No preference</option>
                            {field === 'edible' && <>
                          <option value="1">No</option>
                          <option value="0">Yes</option>
                           </> }
                            {field === 'pets_kids' && <>
                          <option value="0">No</option>
                          <option value="1">Yes</option>
                           </> }
                            {field === 'lifespan' && <>
                          <option value="">No</option>
                          <option value="0">Yes</option>
                           </> }
                            {field === 'water_schedule' && <>
                          <option value="1">No</option>
                          <option value="0">Yes</option>
                           </> }
                            {field === 'nlight' && <>
                          <option value="1">No</option>
                          <option value="0">Yes</option>
                           </> }
                        </select>
                            
                    </div>
                ))}
            </form>
        </div>
    )

}


