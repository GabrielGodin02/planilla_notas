import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // ¡Importante! Esto extiende el objeto jsPDF

const GradeSheet = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: '', area: '', gradeLevel: '',
    t1: '', t2: '', t3: '', t4: '',
    e1: '', e2: '', e3: '',
    x1: '', x2: '', x3: ''
  });
  const [editIndex, setEditIndex] = useState(null);
  const sheetRef = useRef(); 
  const institutionTitlesRef = useRef(); 


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updated = [...students];
      updated[editIndex] = formData;
      setStudents(updated);
      setEditIndex(null);
    } else {
      setStudents([...students, formData]);
    }
    setFormData({
      name: '', area: '', gradeLevel: '',
      t1: '', t2: '', 't3': '', t4: '',
      e1: '', e2: '', e3: '',
      x1: '', x2: '', x3: ''
    });
  };

  const handleEdit = (index) => {
    setFormData(students[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updated = [...students];
    updated.splice(index, 1);
    setStudents(updated);
  };

  const calculateAverage = (...grades) => {
    const nums = grades.map(Number).filter(n => !isNaN(n));
    const sum = nums.reduce((a, b) => a + b, 0);
    return nums.length ? (sum / nums.length).toFixed(2) : '';
  };

  const generatePDF = async () => {
    const pdf = new jsPDF('landscape', 'pt', 'a4'); // 'landscape' para orientación horizontal

    // Asegurarse de que los elementos "no-print" estén ocultos
    const hiddenElements = document.querySelectorAll('.no-print');
    hiddenElements.forEach(el => el.style.display = 'none');

    // --- Definir el contenido de la tabla para autoTable ---
    const head = [
      [
        { content: 'Nombre', rowSpan: 2 },
        { content: 'Área', rowSpan: 2 },
        { content: 'Grado', rowSpan: 2 },
        { content: 'Notas de Tareas', colSpan: 5, styles: { fillColor: [229, 243, 255] } }, // bg-blue-100
        { content: 'Notas de Evaluaciones', colSpan: 4, styles: { fillColor: [255, 255, 224] } }, // bg-yellow-100
        { content: 'Notas de Exposiciones', colSpan: 4, styles: { fillColor: [224, 255, 224] } }, // bg-green-100
        { content: 'Nota\nDefinitiva', rowSpan: 2, styles: { fillColor: [224, 224, 224] } } // bg-gray-300
      ],
      [
        'T1', 'T2', 'T3', 'T4', { content: 'Prom.', styles: { fontStyle: 'bold' } },
        'E1', 'E2', 'E3', { content: 'Prom.', styles: { fontStyle: 'bold' } },
        'X1', 'X2', 'X3', { content: 'Prom.', styles: { fontStyle: 'bold' } }
      ]
    ];

    const body = students.map(s => {
      const tareaProm = calculateAverage(s.t1, s.t2, s.t3, s.t4);
      const evalProm = calculateAverage(s.e1, s.e2, s.e3);
      const expoProm = calculateAverage(s.x1, s.x2, s.x3);
      const finalProm = calculateAverage(tareaProm, evalProm, expoProm);

      return [
        s.name, s.area, s.gradeLevel,
        s.t1, s.t2, s.t3, s.t4, { content: tareaProm, styles: { fontStyle: 'bold' } },
        s.e1, s.e2, s.e3, { content: evalProm, styles: { fontStyle: 'bold' } },
        s.x1, s.x2, s.x3, { content: expoProm, styles: { fontStyle: 'bold' } },
        { content: finalProm, styles: { fontStyle: 'bold', textColor: [0, 0, 128] } } // text-blue-700
      ];
    });

    // --- Definir una función para añadir los títulos de la institución ---
    // Estos títulos se dibujarán en posiciones Y fijas en cada página.
    const addInstitutionHeader = () => {
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      const title1Y = 40; // Posición Y del primer título
      const title2Y = 60; // Posición Y del segundo título

      pdf.setFontSize(16);
      pdf.setTextColor(25, 0, 100); // Azul oscuro
      pdf.text("INSTITUCIÓN EDUCATIVA RURAL", pageWidth / 2, title1Y, { align: 'center' });

      pdf.setFontSize(14);
      pdf.setTextColor(50, 0, 150); // Azul medio
      pdf.text("Luis Antonio Robles", pageWidth / 2, title2Y, { align: 'center' });
    };

    // --- Generar la tabla con autoTable ---
    pdf.autoTable({
      head: head,
      body: body,
      // startY: se puede dejar o se puede omitir si margin.top es suficiente.
      // margin.top es crucial: fuerza a la tabla a iniciar D.E.S.P.U.É.S de esta coordenada Y.
      margin: { top: 90, left: 40, right: 40, bottom: 40 }, // 90pt es suficiente para los títulos (40 y 60) + espacio
      theme: 'grid', 
      styles: {
        fontSize: 8,
        cellPadding: 4,
        halign: 'center',
        valign: 'middle'
      },
      headStyles: {
        fillColor: [200, 200, 200], 
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      },
      bodyStyles: {
        textColor: [0, 0, 0]
      },
      // Callback para añadir los títulos en cada página
      didDrawPage: (data) => {
        addInstitutionHeader(); // Llama a la función de encabezado de institución.
                                // Ya no necesita 'data' para posicionarse, usa posiciones fijas.
      }
    });

    pdf.save('grade_sheet.pdf');

    // Restaurar la visibilidad de los elementos "no-print"
    hiddenElements.forEach(el => el.style.display = '');
  };

  return (
    <div className="p-4">
      {/* Formulario */}
      <form onSubmit={handleSubmit} className="grid grid-cols-4 md:grid-cols-6 gap-2 bg-gray-100 p-4 rounded shadow no-print">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Nombre" className="border p-2 rounded" />
        <input name="area" value={formData.area} onChange={handleChange} placeholder="Área" className="border p-2 rounded" />
        <input name="gradeLevel" value={formData.gradeLevel} onChange={handleChange} placeholder="Grado" className="border p-2 rounded" />
        {["t1", "t2", "t3", "t4", "e1", "e2", "e3", "x1", "x2", "x3"].map((key) => (
          <input key={key} name={key} value={formData[key]} onChange={handleChange} placeholder={key.toUpperCase()} className="border p-2 rounded w-full" />
        ))}
        <button type="submit" className="col-span-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
          {editIndex !== null ? "Actualizar Estudiante" : "Guardar Nota"}
        </button>
      </form>

      {/* Vista previa (esta parte es solo para mostrar en el navegador) */}
      <div
        ref={sheetRef}
        className="bg-white border mt-6 overflow-auto rounded shadow-md"
        style={{ padding: '40px 20px 60px 20px' }}
      >
        {/* Los títulos de la institución los manejaremos por separado si no se van a capturar con html2canvas para el PDF */}
        <div ref={institutionTitlesRef} className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-blue-800">INSTITUCIÓN EDUCATIVA RURAL</h1>
          <h2 className="text-xl font-semibold text-blue-600">Luis Antonio Robles</h2>
        </div>

        <table className="table-auto w-full border-collapse text-xs text-center border border-gray-300">
          <thead>
            <tr>
              <th rowSpan="2" className="border bg-gray-200 align-middle py-2">Nombre</th>
              <th rowSpan="2" className="border bg-gray-200 align-middle py-2">Área</th>
              <th rowSpan="2" className="border bg-gray-200 align-middle py-2">Grado</th>
              <th colSpan="5" className="border bg-blue-100 py-2">Notas de Tareas</th>
              <th colSpan="4" className="border bg-yellow-100 py-2">Notas de Evaluaciones</th>
              <th colSpan="4" className="border bg-green-100 py-2">Notas de Exposiciones</th>
              <th rowSpan="2" className="border bg-gray-300 align-middle py-2">Nota<br />Definitiva</th>
              <th rowSpan="2" className="border bg-red-100 align-middle py-2 no-print">Acciones</th>
            </tr>
            <tr>
              <th className="border py-3">T1</th><th className="border py-3">T2</th><th className="border py-3">T3</th><th className="border py-3">T4</th><th className="border py-3">Prom.</th>
              <th className="border py-3">E1</th><th className="border py-3">E2</th><th className="border py-3">E3</th><th className="border py-3">Prom.</th>
              <th className="border py-3">X1</th><th className="border py-3">X2</th><th className="border py-3">X3</th><th className="border py-3">Prom.</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => {
              const tareaProm = calculateAverage(s.t1, s.t2, s.t3, s.t4);
              const evalProm = calculateAverage(s.e1, s.e2, s.e3);
              const expoProm = calculateAverage(s.x1, s.x2, s.x3);
              const finalProm = calculateAverage(tareaProm, evalProm, expoProm);
              return (
                <tr key={i} className="hover:bg-gray-100">
                  <td className="border py-3">{s.name}</td>
                  <td className="border py-1">{s.area}</td>
                  <td className="border py-1">{s.gradeLevel}</td>
                  <td className="border py-1">{s.t1}</td>
                  <td className="border py-1">{s.t2}</td>
                  <td className="border py-1">{s.t3}</td>
                  <td className="border py-1">{s.t4}</td>
                  <td className="border py-1 font-semibold">{tareaProm}</td>
                  <td className="border py-1">{s.e1}</td>
                  <td className="border py-1">{s.e2}</td>
                  <td className="border py-1">{s.e3}</td>
                  <td className="border py-1 font-semibold">{evalProm}</td>
                  <td className="border py-1">{s.x1}</td>
                  <td className="border py-1">{s.x2}</td>
                  <td className="border py-1">{s.x3}</td>
                  <td className="border py-1 font-semibold">{expoProm}</td>
                  <td className="border py-1 font-bold text-blue-700">{finalProm}</td>
                  <td className="border py-1 no-print">
                    <button onClick={() => handleEdit(i)} className="bg-yellow-300 hover:bg-yellow-400 text-black px-2 py-1 mr-1 rounded text-xs">
                      ✏️ Editar
                    </button>
                    <button onClick={() => handleDelete(i)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Botón PDF */}
      <div className="text-center mt-6 no-print">
        <button onClick={generatePDF} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">
          Descargar PDF
        </button>
      </div>
    </div>
  );
};

export default GradeSheet;