import { Chip } from "@mui/material"

const Patient = ({ name, age, condition }) => {
	return (
		<>
			<Chip
                label={`Imię: ${name}, Wiek: ${age}, Stan: ${condition}`}
                variant="outlined"
                sx={{ margin: '5px' }}
            />
		</>
	)
}

export default Patient
