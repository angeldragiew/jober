import ICandidate from "./candidate.model";

export default interface IJob {
    uid: string,
    title: string,
    description: string,
    type: string,
    category: string,
    likes: any | string[],
    candidates: any | ICandidate[],
    docId?: string | null,
    isActive: boolean,
    status?: string
}