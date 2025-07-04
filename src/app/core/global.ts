import {
    UserGender, UserPronoun, PermissionLevel, Labeling, LabelingTrn, ObservationMedium, ScanStatus, MaleSterilization,
    FemaleSterilization, DocMetaStatus, PlaylistItemStatus, RemoteConfigs, 
    FAEvents, InboxMessageStatus, Calendar, MeasurementSystem, DogBreedStandards,
    DateFormat, NumberFormat, DaysofWeek, Temperature, TimeFormat, HealthRecordStatus,
    ChecklistItemTypeDescriptionPolicy, ChecklistItemTypeTitlePolicy,
    InsuranceStatus, InsuranceStatusTrn,TagsBatchStatus,
    carbs,
    fat,
    minerals,
    ChecklistStatus,
    SubscriptionSource,
    SubscriptionStatus
} from './enums'

export class Globals {
    public static current: any = {};

    public static enums = {
        UserGender,
        UserPronoun,
        PermissionLevel,
        Labeling,
        LabelingTrn,
        ObservationMedium,
        ScanStatus,
        MaleSterilization,
        FemaleSterilization,
        DocMetaStatus,
        PlaylistItemStatus,
        RemoteConfigs,
        FAEvents,
        InboxMessageStatus,
        Calendar,
        DateFormat,
        NumberFormat,
        DaysofWeek,
        Temperature,
        MeasurementSystem,
        TimeFormat,
        HealthRecordStatus,
        ChecklistItemTypeDescriptionPolicy,
        ChecklistItemTypeTitlePolicy,
        DogBreedStandards,
        InsuranceStatus,
        InsuranceStatusTrn,
        carbs,
        fat,
        minerals,
        TagsBatchStatus,
        ChecklistStatus,
        SubscriptionSource,
        SubscriptionStatus
    }

}