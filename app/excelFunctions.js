import Excel from 'exceljs';

export function createExcelWorkbook(){
    const workbook = new Excel.Workbook();
    console.log('Create excel workbook successfully.')
    return workbook;
}

export function createExcelWorksheet(workbook){
    const worksheet = workbook.addWorksheet('Sheet 1');
    console.log('Create excel worksheet successfully.')
    return worksheet;
}

export function createHeaderOfTable(arrayHeaders, worksheet){
    console.log('Create excel table header successfully.')
    worksheet.addRow(arrayHeaders);
}

export function createDataInSpecifyRow(worksheet, rowIndex, data){
    const row = worksheet.getRow(rowIndex);
    row.values = data;
}

export function saveDataInExcelFile(workbook){
    workbook.xlsx.writeFile('../data/script1.xlsx').then(() => {
        //console.log('Excel file created successfully.');
    });
}
