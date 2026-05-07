import { useEffect, useState } from 'react';

import { TextField } from '../form/TextField';
import { updatePrompt, allPropertiesForPrompts, allProperties } from '../../services/apiService';
import type { PropertiesForPrompt } from '../../../types/propertyConnection';
import type { Property } from '../../../types/property';

export function EditComponent({ prompt }) {
  const [title, setTitle] = useState(prompt.title)
  const [text, setText] = useState(prompt.text)
  const [, setPropertiesForPrompt] = useState<PropertiesForPrompt[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [promptProps, setPromptProps] = useState([]); 

  useEffect(() => {
    async function fetchProperties() {
      try {
        const [fetchedProperties, fetchedConnections] = await Promise.all([
          allProperties(),
          allPropertiesForPrompts()
        ]);

        setProperties(fetchedProperties);
        setPropertiesForPrompt(fetchedConnections);

        const connections = fetchedConnections.filter(p => Number(p.prompt_id) === Number(prompt.id));
        const initial = connections
          .map(conn => fetchedProperties.find(prop => prop.id === conn.property_id))
          .filter((prop): prop is Property => prop !== undefined);
        setPromptProps(initial);
      } catch (e) {
        console.error("Fetching properties", e)
      }
    }

    fetchProperties();
  }, [prompt.id]);

  function handlePropChange(isChecked: boolean, propertyId: number) {
    if (isChecked) {
      setPromptProps(prev => prev.filter(p => p.id !== propertyId));
    } else {
      const toAdd = properties.find(p => p.id === propertyId);
      if (toAdd) setPromptProps(prev => [...prev, toAdd]);
    }
  }

  async function handleSave() {
    
    const promptPropsIdArray= promptProps.map(p => p.id)
    const err = await updatePrompt(prompt.id, title, text, "system", promptPropsIdArray)
    if (err) {
      alert(err)
      return
    }
    alert("Saved!")
  }

  return (
    <div>
      <TextField state={title} setState={setTitle} label='Title' />
      <TextField state={text} setState={setText} label="Prompt" />
      {properties.map((property) => {
        const isChecked = promptProps.some(p => p.id === property.id);
        return (
          <li key={property.id}>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => handlePropChange(isChecked, property.id)}
            />
            {property.tag}
          </li>
        );
      })}
      <button onClick={handleSave}>Save</button>
    </div>
  )
}

export default EditComponent
