const fs = require('fs');
const path = require('path');
const docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');
const libre = require('libreoffice-convert');
const util = require('util');
const convertAsync = util.promisify(libre.convert);

const templatePath = path.join(__dirname, '..', 'templates', 'sertifikat_template.docx');
const outputDir = path.join(__dirname, '..', 'output');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const generateSertifikat = async (templateData) => {
    let docxOutputPath = null;

    try {
        // Format tanggal (fungsi ini tidak perlu diubah, sudah disesuaikan di generateSertif)
        const formatTanggal = (tanggal) => {
            if (!tanggal) return '';
            const date = new Date(tanggal);
            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        };

        // Baca template
        const content = fs.readFileSync(templatePath, 'binary');
        const zip = new PizZip(content);

        const doc = new docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true
        });

        // Render template dengan data yang sudah dipersiapkan
        doc.render(templateData);

        // Generate docx buffer
        const docxBuf = doc.getZip().generate({
            type: 'nodebuffer',
            compression: 'DEFLATE'
        });

        // Simpan temporary DOCX
        const tempFileName = `temp_${Date.now()}_${templateData.no_peserta || 'unknown'}.docx`;
        docxOutputPath = path.join(outputDir, tempFileName);
        fs.writeFileSync(docxOutputPath, docxBuf);

        // Konversi ke PDF
        const pdfBuf = await convertAsync(docxBuf, '.pdf', undefined);

        // Simpan PDF ke output
        const pdfFileName = `sertifikat_${templateData.no_peserta}.pdf`;
        const pdfOutputPath = path.join(outputDir, pdfFileName);
        fs.writeFileSync(pdfOutputPath, pdfBuf);

        console.log(`PDF saved to: ${pdfOutputPath}`);

        return pdfBuf;

    } catch (error) {
        console.error('Error details:', error);
        throw new Error(`Failed to generate certificate: ${error.message}`);
    } finally {
        // Cleanup temporary DOCX file
        if (docxOutputPath && fs.existsSync(docxOutputPath)) {
            fs.unlinkSync(docxOutputPath);
            console.log('Temporary DOCX file cleaned up');
        }
    }
};



module.exports = { generateSertifikat };
