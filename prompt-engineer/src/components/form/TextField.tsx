export function TextField({label, name}) {
    return (
        <label>
            {label}
            <input 
                type="text"
                name={name}
                placeholder="Hey tell me a joke"
            />
        </label>
    )
}

export default TextField
