export interface ITestimonial {
  id: number,
  job: string,
  name: string,
  description: string,
  image: string,
}

export interface ITestimonialEditOrCreate {
  id: number,
  jobAr: string,
  jobEn: string,
  nameAr: string,
  nameEn: string,
  descriptionAr: string,
  descriptionEn: string,
  image: string,
}
