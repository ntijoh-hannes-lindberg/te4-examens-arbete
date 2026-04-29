export function TextField({state, setState, label}) {
    function handleChange(e) {
        setState(e.target.value)
    }

    return (
        <label>
            {label}
            <input 
                type="text"
                name={name}
                placeholder="Hey tell me a joke"
                value={state}
                onChange={handleChange}
            />
        </label>
    )
}

export default TextField
