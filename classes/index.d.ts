class Task {
    _id: import("mongoose").Types.ObjectId
    text: string
    attachment?: string
    due: string
    checked: boolean
    order: number
    isExpired?: boolean
}

class ResByDate {
    [field: string]: Array<Task>
}