import ICandidate from "./candidate.model";

export default interface IJob {
    uid: string,
    title: string,
    description: string,
    type: string,
    category: string,
    likes: string[],
    candidates: any,
    docId?: string | null,
    isActive: boolean
}