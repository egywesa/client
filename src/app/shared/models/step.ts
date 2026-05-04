export interface IStep {
  id: number,
  title: string,
  name: string,
  description: string,
  icon: string,
  image: string,
}

export interface IStepEditOrCreate {
  id: number,
  titleAr: string,
  titleEn: string,
  nameAr: string,
  nameEn: string,
  descriptionAr: string,
  descriptionEn: string,
  icon: string,
  image: string,
}
