export interface ISetting {
    id: number,
    title: string,
    keyword: string,
    description: string,
    paragraph: string,
    updatedAt: string,
    image: string

  }
  
  export interface ISettingEditOrCreate {
    id: number,
    title: string,
    TitleAr: string,
    Keyword: string,
    description: string,
    paragraph: string,
    ParagraphAr: string,
    UpdatedAt: string,
    image: string
  }
  