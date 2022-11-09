export default interface IJob {
    uid: string,
    title: string,
    description: string,
    type: string,
    category: string,
    likes: string[],
    candidates: string[],
    docId?: string | null
}