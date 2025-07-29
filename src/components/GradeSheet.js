import React, { useState, useRef } from 'react';
import { Download, Edit2, Trash2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const InputField = ({
  label,
  value,
  onChange,
  type = 'text',
  className = '',
  readOnly = false,
}) => (
  <div className={`flex flex-col ${className}`}>
    <label className="text-gray-700 text-sm font-bold mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={`bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
        readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
      }`}
    />
  </div>
);

const GradeSheet = () => {
  const [students, setStudents] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({
    area: '',
    gradeLevel: '',
    studentName: '',
    tasks: ['', '', '', ''],
    evaluations: ['', '', ''],
    expositions: ['', '', ''],
  });
  const sheetRef = useRef(null);

  const calculateDefinitive = (grades) => {
    const validGrades = grades
      .filter((g) => g !== '' && !isNaN(parseFloat(g)))
      .map(parseFloat);
    if (validGrades.length === 0) return '';
    const sum = validGrades.reduce((acc, curr) => acc + curr, 0);
    return (sum / validGrades.length).toFixed(1);
  };

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (arrayName, index, value) => {
    const newArray = [...form[arrayName]];
    newArray[index] = value;
    setForm((prev) => ({ ...prev, [arrayName]: newArray }));
  };

  const handleSubmit = () => {
    if (!form.studentName) return alert('Falta el nombre del estudiante.');
    const newStudent = {
      ...form,
      definitiveTask: calculateDefinitive(form.tasks),
      definitiveEvaluation: calculateDefinitive(form.evaluations),
      definitiveExposition: calculateDefinitive(form.expositions),
    };
    newStudent.finalOverallGrade = calculateDefinitive([
      newStudent.definitiveTask,
      newStudent.definitiveEvaluation,
      newStudent.definitiveExposition,
    ]);

    if (editingIndex !== null) {
      const updated = [...students];
      updated[editingIndex] = newStudent;
      setStudents(updated);
      setEditingIndex(null);
    } else {
      setStudents((prev) => [...prev, newStudent]);
    }
    setForm({
      area: '',
      gradeLevel: '',
      studentName: '',
      tasks: ['', '', '', ''],
      evaluations: ['', '', ''],
      expositions: ['', '', ''],
    });
  };

  const handleEdit = (index) => {
    setForm(students[index]);
    setEditingIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (index) => {
    if (window.confirm('¿Seguro que deseas eliminar este estudiante?')) {
      setStudents((prev) => prev.filter((_, i) => i !== index));
      if (editingIndex === index) {
        setEditingIndex(null);
        setForm({
          area: '',
          gradeLevel: '',
          studentName: '',
          tasks: ['', '', '', ''],
          evaluations: ['', '', ''],
          expositions: ['', '', ''],
        });
      }
    }
  };

  // PDF horizontal y mayor calidad
  const downloadPdf = () => {
    const input = sheetRef.current;
    html2canvas(input, { scale: 3, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4'); // horizontal (landscape)
      const imgWidth = 297; // ancho en horizontal
      const pageHeight = 210; // alto en horizontal
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`Boletin_Estudiantes.pdf`);
    });
  };

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-blue-700">
            INSTITUCIÓN EDUCATIVA RURAL
          </h1>
          <h2 className="text-xl font-semibold text-blue-500">
            LUIS ANTONIO ROBLES
          </h2>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-2 text-gray-800">
            Formulario de Registro
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <InputField
              label="Área"
              value={form.area}
              onChange={(e) => handleInputChange('area', e.target.value)}
            />
            <InputField
              label="Grado"
              value={form.gradeLevel}
              onChange={(e) => handleInputChange('gradeLevel', e.target.value)}
            />
            <InputField
              label="Nombre del Estudiante"
              value={form.studentName}
              onChange={(e) => handleInputChange('studentName', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
            {form.tasks.map((task, i) => (
              <InputField
                key={`task-${i}`}
                label={`Tarea ${i + 1}`}
                value={task}
                onChange={(e) =>
                  handleArrayChange('tasks', i, e.target.value)
                }
                type="number"
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {form.evaluations.map((ev, i) => (
              <InputField
                key={`eval-${i}`}
                label={`Evaluación ${i + 1}`}
                value={ev}
                onChange={(e) =>
                  handleArrayChange('evaluations', i, e.target.value)
                }
                type="number"
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {form.expositions.map((ex, i) => (
              <InputField
                key={`expo-${i}`}
                label={`Exposición ${i + 1}`}
                value={ex}
                onChange={(e) =>
                  handleArrayChange('expositions', i, e.target.value)
                }
                type="number"
              />
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {editingIndex !== null
              ? 'Actualizar Estudiante'
              : 'Agregar Estudiante'}
          </button>
        </div>

        <div ref={sheetRef} className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-blue-700">
              INSTITUCIÓN EDUCATIVA RURAL
            </h1>
            <h2 className="text-lg font-semibold text-blue-500">
              LUIS ANTONIO ROBLES
            </h2>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Boletín de Notas
          </h2>
          {students.length === 0 ? (
            <p className="text-gray-500">No hay estudiantes agregados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm text-left border border-collapse">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border p-1" rowSpan="2">
                      Nombre
                    </th>
                    <th className="border p-1" rowSpan="2">
                      Área
                    </th>
                    <th className="border p-1" rowSpan="2">
                      Grado
                    </th>
                    <th className="border p-1 text-center" colSpan="4">
                      Tareas
                    </th>
                    <th className="border p-1 text-center" colSpan="3">
                      Evaluaciones
                    </th>
                    <th className="border p-1 text-center" colSpan="3">
                      Exposiciones
                    </th>
                    <th className="border p-1" rowSpan="2">
                      Nota Final
                    </th>
                    <th className="border p-1" rowSpan="2">
                      Opciones
                    </th>
                  </tr>
                  <tr className="bg-blue-50">
                    <th className="border p-1">T1</th>
                    <th className="border p-1">T2</th>
                    <th className="border p-1">T3</th>
                    <th className="border p-1">T4</th>
                    <th className="border p-1">E1</th>
                    <th className="border p-1">E2</th>
                    <th className="border p-1">E3</th>
                    <th className="border p-1">X1</th>
                    <th className="border p-1">X2</th>
                    <th className="border p-1">X3</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, index) => (
                    <tr key={index} className="hover:bg-blue-50">
                      <td className="border p-1">{s.studentName}</td>
                      <td className="border p-1">{s.area}</td>
                      <td className="border p-1">{s.gradeLevel}</td>
                      {s.tasks.map((t, i) => (
                        <td
                          key={`t-${i}`}
                          className="border p-1 text-center"
                        >
                          {t}
                        </td>
                      ))}
                      {s.evaluations.map((e, i) => (
                        <td
                          key={`e-${i}`}
                          className="border p-1 text-center"
                        >
                          {e}
                        </td>
                      ))}
                      {s.expositions.map((x, i) => (
                        <td
                          key={`x-${i}`}
                          className="border p-1 text-center"
                        >
                          {x}
                        </td>
                      ))}
                      <td className="border p-1 text-center font-bold">
                        {s.finalOverallGrade}
                      </td>
                      <td className="border p-1 text-center">
                        <button
                          className="text-blue-600 hover:text-blue-800 mr-2"
                          title="Editar"
                          onClick={() => handleEdit(index)}
                        >
                          <Edit2 className="inline w-4 h-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          title="Eliminar"
                          onClick={() => handleDelete(index)}
                        >
                          <Trash2 className="inline w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={downloadPdf}
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg shadow-md inline-flex items-center gap-2"
          >
            <Download className="w-5 h-5" /> Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradeSheet;import React, { useState, useRef } from 'react';
import { Download, Edit2, Trash2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const InputField = ({
  label,
  value,
  onChange,
  type = 'text',
  className = '',
  readOnly = false,
}) => (
  <div className={`flex flex-col ${className}`}>
    <label className="text-gray-700 text-sm font-bold mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={`bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
        readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
      }`}
    />
  </div>
);

const GradeSheet = () => {
  const [students, setStudents] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({
    area: '',
    gradeLevel: '',
    studentName: '',
    tasks: ['', '', '', ''],
    evaluations: ['', '', ''],
    expositions: ['', '', ''],
  });
  const sheetRef = useRef(null);

  const calculateDefinitive = (grades) => {
    const validGrades = grades
      .filter((g) => g !== '' && !isNaN(parseFloat(g)))
      .map(parseFloat);
    if (validGrades.length === 0) return '';
    const sum = validGrades.reduce((acc, curr) => acc + curr, 0);
    return (sum / validGrades.length).toFixed(1);
  };

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (arrayName, index, value) => {
    const newArray = [...form[arrayName]];
    newArray[index] = value;
    setForm((prev) => ({ ...prev, [arrayName]: newArray }));
  };

  const handleSubmit = () => {
    if (!form.studentName) return alert('Falta el nombre del estudiante.');
    const newStudent = {
      ...form,
      definitiveTask: calculateDefinitive(form.tasks),
      definitiveEvaluation: calculateDefinitive(form.evaluations),
      definitiveExposition: calculateDefinitive(form.expositions),
    };
    newStudent.finalOverallGrade = calculateDefinitive([
      newStudent.definitiveTask,
      newStudent.definitiveEvaluation,
      newStudent.definitiveExposition,
    ]);

    if (editingIndex !== null) {
      const updated = [...students];
      updated[editingIndex] = newStudent;
      setStudents(updated);
      setEditingIndex(null);
    } else {
      setStudents((prev) => [...prev, newStudent]);
    }
    setForm({
      area: '',
      gradeLevel: '',
      studentName: '',
      tasks: ['', '', '', ''],
      evaluations: ['', '', ''],
      expositions: ['', '', ''],
    });
  };

  const handleEdit = (index) => {
    setForm(students[index]);
    setEditingIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (index) => {
    if (window.confirm('¿Seguro que deseas eliminar este estudiante?')) {
      setStudents((prev) => prev.filter((_, i) => i !== index));
      if (editingIndex === index) {
        setEditingIndex(null);
        setForm({
          area: '',
          gradeLevel: '',
          studentName: '',
          tasks: ['', '', '', ''],
          evaluations: ['', '', ''],
          expositions: ['', '', ''],
        });
      }
    }
  };

  // PDF horizontal y mayor calidad
  const downloadPdf = () => {
    const input = sheetRef.current;
    html2canvas(input, { scale: 3, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4'); // horizontal (landscape)
      const imgWidth = 297; // ancho en horizontal
      const pageHeight = 210; // alto en horizontal
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`Boletin_Estudiantes.pdf`);
    });
  };

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-blue-700">
            INSTITUCIÓN EDUCATIVA RURAL
          </h1>
          <h2 className="text-xl font-semibold text-blue-500">
            LUIS ANTONIO ROBLES
          </h2>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-2 text-gray-800">
            Formulario de Registro
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <InputField
              label="Área"
              value={form.area}
              onChange={(e) => handleInputChange('area', e.target.value)}
            />
            <InputField
              label="Grado"
              value={form.gradeLevel}
              onChange={(e) => handleInputChange('gradeLevel', e.target.value)}
            />
            <InputField
              label="Nombre del Estudiante"
              value={form.studentName}
              onChange={(e) => handleInputChange('studentName', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
            {form.tasks.map((task, i) => (
              <InputField
                key={`task-${i}`}
                label={`Tarea ${i + 1}`}
                value={task}
                onChange={(e) =>
                  handleArrayChange('tasks', i, e.target.value)
                }
                type="number"
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {form.evaluations.map((ev, i) => (
              <InputField
                key={`eval-${i}`}
                label={`Evaluación ${i + 1}`}
                value={ev}
                onChange={(e) =>
                  handleArrayChange('evaluations', i, e.target.value)
                }
                type="number"
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {form.expositions.map((ex, i) => (
              <InputField
                key={`expo-${i}`}
                label={`Exposición ${i + 1}`}
                value={ex}
                onChange={(e) =>
                  handleArrayChange('expositions', i, e.target.value)
                }
                type="number"
              />
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {editingIndex !== null
              ? 'Actualizar Estudiante'
              : 'Agregar Estudiante'}
          </button>
        </div>

        <div ref={sheetRef} className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-blue-700">
              INSTITUCIÓN EDUCATIVA RURAL
            </h1>
            <h2 className="text-lg font-semibold text-blue-500">
              LUIS ANTONIO ROBLES
            </h2>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Boletín de Notas
          </h2>
          {students.length === 0 ? (
            <p className="text-gray-500">No hay estudiantes agregados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm text-left border border-collapse">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border p-1" rowSpan="2">
                      Nombre
                    </th>
                    <th className="border p-1" rowSpan="2">
                      Área
                    </th>
                    <th className="border p-1" rowSpan="2">
                      Grado
                    </th>
                    <th className="border p-1 text-center" colSpan="4">
                      Tareas
                    </th>
                    <th className="border p-1 text-center" colSpan="3">
                      Evaluaciones
                    </th>
                    <th className="border p-1 text-center" colSpan="3">
                      Exposiciones
                    </th>
                    <th className="border p-1" rowSpan="2">
                      Nota Final
                    </th>
                    <th className="border p-1" rowSpan="2">
                      Opciones
                    </th>
                  </tr>
                  <tr className="bg-blue-50">
                    <th className="border p-1">T1</th>
                    <th className="border p-1">T2</th>
                    <th className="border p-1">T3</th>
                    <th className="border p-1">T4</th>
                    <th className="border p-1">E1</th>
                    <th className="border p-1">E2</th>
                    <th className="border p-1">E3</th>
                    <th className="border p-1">X1</th>
                    <th className="border p-1">X2</th>
                    <th className="border p-1">X3</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, index) => (
                    <tr key={index} className="hover:bg-blue-50">
                      <td className="border p-1">{s.studentName}</td>
                      <td className="border p-1">{s.area}</td>
                      <td className="border p-1">{s.gradeLevel}</td>
                      {s.tasks.map((t, i) => (
                        <td
                          key={`t-${i}`}
                          className="border p-1 text-center"
                        >
                          {t}
                        </td>
                      ))}
                      {s.evaluations.map((e, i) => (
                        <td
                          key={`e-${i}`}
                          className="border p-1 text-center"
                        >
                          {e}
                        </td>
                      ))}
                      {s.expositions.map((x, i) => (
                        <td
                          key={`x-${i}`}
                          className="border p-1 text-center"
                        >
                          {x}
                        </td>
                      ))}
                      <td className="border p-1 text-center font-bold">
                        {s.finalOverallGrade}
                      </td>
                      <td className="border p-1 text-center">
                        <button
                          className="text-blue-600 hover:text-blue-800 mr-2"
                          title="Editar"
                          onClick={() => handleEdit(index)}
                        >
                          <Edit2 className="inline w-4 h-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          title="Eliminar"
                          onClick={() => handleDelete(index)}
                        >
                          <Trash2 className="inline w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={downloadPdf}
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg shadow-md inline-flex items-center gap-2"
          >
            <Download className="w-5 h-5" /> Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradeSheet;
