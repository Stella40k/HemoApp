export const useForm =(initialState = {}) => {
    const [formState, setFormState] = useState(initialState);

    const handleChange = ({ target }) => {
        const { name, value } = target;
        setFormState({
            ...formState,
            [name]: value,
        });
    }

    const handleReset = () => {
        setFormState ( initialValue);
    }
    return{
        ...formState,
        formState,
        handleChange,
        handleReset,
    };
}