'use client'

import { useState } from "react"

export default function BeerForm({ initialData = {}, action}) {
	const [formData, setFormData] = useState({
		name: initialData.name || '',
		type: initialData.type || '',
		abv: initialData.abv || '',
		brewery: initialData.brewery || '',
		description: initialData.description || '',
		ibu: initialData.ibu || ''
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData(prev => ({
			...prev,
			[e.target.name]: e.target.value,
		}))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		await action(formData)
	}

	return (
		<form onSubmit={handleSubmit}>
			<input 
				type="text"
				name="name"
				value={formData.name}
				onChange={handleChange}
				placeholder="Name"
			/>
			<input 
				type="text"
				name="type"
				value={formData.type}
				onChange={handleChange}
				placeholder="Type"
			/>
			<input 
				type="text"
				name="abv"
				value={formData.abv}
				onChange={handleChange}
				placeholder="ABV"
			/>
			<input 
				type="text"
				name="brewery"
				value={formData.brewery}
				onChange={handleChange}
				placeholder="Brewery"
			/>
			<input 
				type="text"
				name="description"
				value={formData.description}
				onChange={handleChange}
				placeholder="Description"
			/>
			<input 
				type="text"
				name="ibu"
				value={formData.ibu}
				onChange={handleChange}
				placeholder="IBU"
			/>
			<button type="submit">Submit</button>
		</form>
	)
}