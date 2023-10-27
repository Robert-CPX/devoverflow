'use server'

import { JobListSchema } from "../validations"
import { GetJobsParams } from "./shared"

export const getJobs = async (params: GetJobsParams) => {
  const { query = "software", page = 1, pageSize = 20, country } = params
  const numPages = Math.ceil(pageSize / 10)

  let url = `https://jsearch.p.rapidapi.com/search?query=${query}&page=${page}&num_pages=${numPages}`
  if (country) {
    url += `&country=${country}`
  }
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '8855245edbmshb817fc2c3bb98d5p1cabe8jsn8e0ed8da5942',
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    if (result.status !== "OK") {
      console.log(result)
      throw new Error("something went wrong")
    }
    const parsedResult = JobListSchema.parse(result.data)
    const isNext = (page < 100 && numPages < 20)
    return { jobs: parsedResult, isNext };
  } catch (error) {
    console.log("error")
    throw error
  }
}

export const getAllCountries = async () => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all", { method: 'GET' })
    const result = await response.json()
    const countries: { name: string, value: string, flag: string }[] = result.map((country: any) => {
      return {
        name: country.name.common,
        value: country.name.common.toLowerCase(),
        flag: country.flag,
      }
    })
    return countries
  } catch (error) {
    console.log("error")
    throw error
  }
}