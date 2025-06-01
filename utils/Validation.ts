import { IncidentReport, IncidentType, IncidentCrashData, QuickReport, ReportType, SafetyPerceptionReport, IncidentInfrastructureData, IncidentEquipmentData, AuditReport } from "../type.d";

export const isValidReport = (report: SafetyPerceptionReport | QuickReport | IncidentReport | AuditReport, reportType: ReportType) => {
    switch (reportType) {
        case ReportType.SafetyPerception:
            const safetyReport = report as SafetyPerceptionReport;

            return safetyReport.userType && safetyReport.roadType && safetyReport.safetyLevel && safetyReport.reportType && safetyReport.reasons.length > 0 && safetyReport.images.length > 0;

        case ReportType.Quick:
            const quickReport = report as QuickReport;

            return quickReport.roadType && quickReport.conditionType && quickReport.conditionDescription && quickReport.severityLevel && quickReport.reportType && quickReport.images.length > 0;

        case ReportType.Incident:
            const incidentReport = report as IncidentReport;

            let isValidIncidentTypeData = false;
            // check the different incidentTypeData having the required properties
            switch (incidentReport.incidentType) {
                case IncidentType.Crash:
                    isValidIncidentTypeData = (incidentReport.incidentTypeData as IncidentCrashData).count.some((item) => item.number > 0);
                    break;
                case IncidentType.Infrastructure:
                    isValidIncidentTypeData = (incidentReport.incidentTypeData as IncidentInfrastructureData).reasons.length > 0;
                    break;
                case IncidentType.Equipment:
                    isValidIncidentTypeData = (incidentReport.incidentTypeData as IncidentEquipmentData).reasons.length > 0;
                    break;
                default:
                    break;
            }
            
            return incidentReport.roadType && incidentReport.incidentType && isValidIncidentTypeData && incidentReport.reportType && incidentReport.description && incidentReport.images.length > 0;

        case ReportType.Audit:
            const auditReport = report as AuditReport;
            
            return auditReport.userId && auditReport.auditRoadType && auditReport.reportType && auditReport.author && auditReport.weatherCondition && auditReport.images.length > 0;
        default:
            return false;
    }
}