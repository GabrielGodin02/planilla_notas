import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
      t1: '', t2: '', t3: '', t4: '',
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

  const generatePDF = () => {
    const hiddenElements = document.querySelectorAll('.no-print');
    hiddenElements.forEach(el => el.style.display = 'none');

    html2canvas(sheetRef.current, { scale: 3 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('grade_sheet.pdf');

      hiddenElements.forEach(el => el.style.display = '');
    });
  };

  const calculateAverage = (...grades) => {
    const nums = grades.map(Number).filter(n => !isNaN(n));
    const sum = nums.reduce((a, b) => a + b, 0);
    return nums.length ? (sum / nums.length).toFixed(2) : '';
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

      {/* Vista previa */}
      <div
        ref={sheetRef}
        className="bg-white border mt-6 overflow-auto rounded shadow-md"
        style={{ padding: '40px 20px 60px 20px' }}
      >
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-blue-800">INSTITUCIÓN EDUCATIVA RURAL</h1>
          <h2 className="text-xl font-semibold text-blue-600">Luis Antonio Robles</h2>
        </div>

        <table className="table-auto w-full border-collapse text-xs text-center border border-gray-300">
          <thead>
            <tr>
              <th rowSpan="2" className="border bg-gray-200 align-middle py-2">Nombre</th>
              <th rowSpan="2" className="border bg-gray-200 align-middle py-2">Área</th>
              <th rowSpan="2" className="border bg-gray-200 align-middle py-2">Grado</th>
              <th colSpan="5" className="border bg-blue-100 py-1">Notas de Tareas</th>
              <th colSpan="4" className="border bg-yellow-100 py-1">Notas de Evaluaciones</th>
              <th colSpan="4" className="border bg-green-100 py-1">Notas de Exposiciones</th>
              <th rowSpan="2" className="border bg-gray-300 align-middle py-2">Nota<br />Definitiva</th>
              <th rowSpan="2" className="border bg-red-100 align-middle py-2 no-print">Acciones</th>
            </tr>
            <tr>
              <th className="border">T1</th><th className="border">T2</th><th className="border">T3</th><th className="border">T4</th><th className="border">Prom.</th>
              <th className="border">E1</th><th className="border">E2</th><th className="border">E3</th><th className="border">Prom.</th>
              <th className="border">X1</th><th className="border">X2</th><th className="border">X3</th><th className="border">Prom.</th>
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
                  <td className="border py-1">{s.name}</td>
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
