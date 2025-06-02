import { AuditReport, UserType } from "../type.d";

// Helper to format date
const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
};

export const createAuditReport = (
    auditReportData: AuditReport,
    locationImageUrl: string,
    questionsData: { type: UserType; questions: { question: string; answers: string[] }[] }[]
) => {
    // Generate table rows for pedestrian answers
    const pedestrianAnswersHtml = auditReportData.answers.pedestrian
        .map((selectedAnswer, index) => {
            const questionData = questionsData.find(q => q.type === UserType.Pedestrian)?.questions[index];
            if (questionData) {
                const question = questionData.question;
                const allAnswers = questionData.answers.join(', ');
                return `
                    <tr>
                        <td>${question}</td>
                        <td>${allAnswers}</td>
                        <td class="selected-answer">${selectedAnswer}</td>
                    </tr>
                `;
            }
            return '';
        })
        .join('');

    // Generate table rows for cyclist answers
    const cyclistAnswersHtml = auditReportData.answers.cyclist
        .map((selectedAnswer, index) => {
            const questionData = questionsData.find(q => q.type === UserType.Cyclist)?.questions[index];
            if (questionData) {
                const question = questionData.question;
                const allAnswers = questionData.answers.join(', ');
                return `
                    <tr>
                        <td>${question}</td>
                        <td>${allAnswers}</td>
                        <td class="selected-answer">${selectedAnswer}</td>
                    </tr>
                `;
            }
            return '';
        })
        .join('');

    
        // Generate table rows for motocyclist answers
    const motocyclistAnswersHtml = auditReportData.answers.pedestrian
        .map((selectedAnswer, index) => {
            const questionData = questionsData.find(q => q.type === UserType.Motocyclist)?.questions[index];
            if (questionData) {
                const question = questionData.question;
                const allAnswers = questionData.answers.join(', ');
                return `
                    <tr>
                        <td>${question}</td>
                        <td>${allAnswers}</td>
                        <td class="selected-answer">${selectedAnswer}</td>
                    </tr>
                `;
            }
            return '';
        })
        .join('');

    
        // Generate table rows for cars answers
    const carAnswersHtml = auditReportData.answers.car
        .map((selectedAnswer, index) => {
            const questionData = questionsData.find(q => q.type === UserType.Car)?.questions[index];
            if (questionData) {
                const question = questionData.question;
                const allAnswers = questionData.answers.join(', ');
                return `
                    <tr>
                        <td>${question}</td>
                        <td>${allAnswers}</td>
                        <td class="selected-answer">${selectedAnswer}</td>
                    </tr>
                `;
            }
            return '';
        })
        .join('');

    // Generate image gallery HTML
    const imageGalleryHtml = auditReportData.images
        .map(
            imageUrl => `
            <img src="${imageUrl}" alt="Audit Report Image" onerror="this.src='https://placehold.co/400x300/CCCCCC/333333?text=Image+Load+Error';">
        `
        )
        .join('');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Audit Report</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            line-height: 1.6;
            -webkit-print-color-adjust: exact;
            box-sizing: border-box;
        }
        .report-container {
            max-width: 800px;
            background-color: #ffffff;
        }
        .report-header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 20px;
        }
        .report-header h1 {
            font-size: 2em;
            color: #2c3e50;
            margin-bottom: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .report-header p {
            font-size: 0.95em;
            color: #7f8c8d;
            margin: 5px 0;
        }
        .section-title {
            font-size: 1.6em;
            color: #34495e;
            margin-top: 30px;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e0e0e0;
            font-weight: 600;
        }
        /* Location Image Section */
        .location-image-section {
            text-align: center;
            margin-top: 25px;
            margin-bottom: 30px;
            padding: 15px;
            background-color: #fcfcfc;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
        }

        .location-image-section img {
            max-width: 70%; /* Max width 70% */
            min-width: 250px; /* Minimum width 250px */
            height: 200px; /* Fixed height, not too high */
            object-fit: cover; /* Cover the area, cropping if necessary */
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            display: block; /* Centers the image using margin auto */
            margin: 0 auto 10px auto;
        }

        .location-image-section p {
            font-size: 0.9em;
            color: #555;
            margin-top: 10px;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            border-radius: 8px;
            overflow: hidden;
        }
        .data-table th, .data-table td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #f0f0f0;
        }
        .data-table th {
            background-color: #ecf0f1;
            color: #2c3e50;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.85em;
        }
        .data-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .data-table tr:hover {
            background-color: #f0f8ff;
        }
        .selected-answer {
            font-weight: 600;
            color: #27ae60;
        }
        .image-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 20px;
            padding: 10px;
            background-color: #fcfcfc;
            border-radius: 8px;
            border: 1px dashed #d0d0d0;
        }
        .image-gallery img {
            width: 100%;
            max-width: 200px;
            height: 150px;
            object-fit: cover;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            transition: transform 0.2s ease-in-out;
        }
        .image-gallery img:hover {
            transform: scale(1.03);
        }
        .report-footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            color: #7f8c8d;
            font-size: 0.85em;
        }
    </style>
</head>
<body>
    <div class="report-container">
        <header class="report-header">
            <h1>Audit Report: ${auditReportData.auditRoadType}</h1>
            <p>Date: ${formatDate(auditReportData.createdAt)}</p>
            <p>Author: ${auditReportData.author}</p>
            <p>Weather Condition: ${auditReportData.weatherCondition}</p>
        </header>
        <section class="report-details">
            <h2 class="section-title">Audit Details</h2>

            <div class="location-image-section">
                <img src="${locationImageUrl}" alt="Location of the Report" onerror="this.src='https://placehold.co/600x200/CCCCCC/333333?text=Location+Image+Error';">
                <p>Image: location of the report</p>
            </div>

            <h3 style="font-size: 1.2em; color: #34495e; margin-top: 20px; margin-bottom: 10px;">Pedestrian Questions</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Question</th>
                        <th>All Possible Answers</th>
                        <th>Selected Answer</th>
                    </tr>
                </thead>
                <tbody>
                    ${pedestrianAnswersHtml}
                </tbody>
            </table>

            <h3 style="font-size: 1.2em; color: #34495e; margin-top: 20px; margin-bottom: 10px;">Cyclist Questions</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Question</th>
                        <th>All Possible Answers</th>
                        <th>Selected Answer</th>
                    </tr>
                </thead>
                <tbody>
                    ${cyclistAnswersHtml}
                </tbody>
            </table>

            <h3 style="font-size: 1.2em; color: #34495e; margin-top: 20px; margin-bottom: 10px;">Motocyclist Questions</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Question</th>
                        <th>All Possible Answers</th>
                        <th>Selected Answer</th>
                    </tr>
                </thead>
                <tbody>
                    ${motocyclistAnswersHtml}
                </tbody>
            </table>

            <h3 style="font-size: 1.2em; color: #34495e; margin-top: 20px; margin-bottom: 10px;">Car, Buses and Trucks Questions</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Question</th>
                        <th>All Possible Answers</th>
                        <th>Selected Answer</th>
                    </tr>
                </thead>
                <tbody>
                    ${carAnswersHtml}
                </tbody>
            </table>
        </section>
        <section class="report-images">
            <h2 class="section-title">Associated Images</h2>
            <div class="image-gallery">
                ${imageGalleryHtml}
            </div>
        </section>
        <footer class="report-footer">
            <p>Report produced by Datamobilize</p>
        </footer>
    </div>
</body>
</html>
    `;
};
