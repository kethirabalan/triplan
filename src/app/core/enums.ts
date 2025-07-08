
export enum DocMetaStatus {
    Live = 'live', // All documents are Live by default
    Delete = 'delete', // This is for Recursive delete to be done via cloud function
    Suspend = 'suspend'
}
