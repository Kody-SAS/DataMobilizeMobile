import { IncidentReport, QuickReport, ReportType, SafetyPerceptionReport } from "../type.d";

export const isValidReport = (report: SafetyPerceptionReport | QuickReport | IncidentReport, reportType: ReportType) => {
    switch (reportType) {
        case ReportType.SafetyPerception:
            const safetyReport = report as SafetyPerceptionReport;

            return safetyReport.userType && safetyReport.roadType && safetyReport.safetyLevel && safetyReport.reportType && safetyReport.reasons.length > 0 && safetyReport.images.length > 0;

        case ReportType.Quick:
            const quickReport = report as QuickReport;

            return quickReport.roadType && quickReport.conditionType && quickReport.conditionDescription && quickReport.severityLevel && quickReport.reportType && quickReport.images.length > 0;

        case ReportType.Incident:
            const incidentReport = report as IncidentReport;
            
            return incidentReport.roadType && incidentReport.incidentType && incidentReport.reportType && incidentReport.description && incidentReport.images.length > 0;
        default:
            return false;
    }
}