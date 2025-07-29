import React, { useState } from 'react';
import { motion } from 'framer-motion';

const InputField = ({ label, value, onChange, type = 'text', className = '' }) => (
  <div className={`flex flex-col ${className}`}>
    <label className="text-gray-700 text-sm font-bold mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

const TextAreaField = ({ label, value, onChange, className = '' }) => (
  <div className={`flex flex-col ${className}`}>
    <label className="text-gray-700 text-sm font-bold mb-1">{label}</label>
    <textarea
      value={value}
      onChange={onChange}
      className="bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
      rows="3"
    ></textarea>
  </div>
);

const CharacterSheet = () => {
  const [character, setCharacter] = useState({
    name: 'Nombre del Personaje',
    player: 'Nombre del Jugador',
    campaign: 'Nombre de la Campaña',
    race: 'Raza',
    class: 'Clase',
    level: 1,
    alignment: 'Alineamiento',
    background: 'Trasfondo',
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    hp: 10,
    ac: 10,
    speed: 30,
    initiative: 0,
    skills: 'Habilidades...',
    equipment: 'Equipo...',
    abilities: 'Habilidades Especiales...',
    notes: 'Notas del Jugador...',
  });

  const handleChange = (field, value) => {
    setCharacter(prev => ({ ...prev, [field]: value }));
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      className="bg-white p-8 rounded-lg shadow-xl max-w-4xl mx-auto my-8 border-2 border-gray-300"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.h1 variants={sectionVariants} className="text-3xl font-extrabold text-center text-gray-900 mb-6">
        Hoja de Personaje
      </motion.h1>

      <motion.div variants={sectionVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <InputField label="Nombre del Personaje" value={character.name} onChange={(e) => handleChange('name', e.target.value)} />
        <InputField label="Nombre del Jugador" value={character.player} onChange={(e) => handleChange('player', e.target.value)} />
        <InputField label="Campaña" value={character.campaign} onChange={(e) => handleChange('campaign', e.target.value)} />
      </motion.div>

      <motion.div variants={sectionVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <InputField label="Raza" value={character.race} onChange={(e) => handleChange('race', e.target.value)} />
        <InputField label="Clase" value={character.class} onChange={(e) => handleChange('class', e.target.value)} />
        <InputField label="Nivel" value={character.level} onChange={(e) => handleChange('level', e.target.value)} type="number" />
        <InputField label="Alineamiento" value={character.alignment} onChange={(e) => handleChange('alignment', e.target.value)} />
      </motion.div>

      <motion.div variants={sectionVariants} className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">Atributos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <InputField label="Fuerza" value={character.strength} onChange={(e) => handleChange('strength', e.target.value)} type="number" />
          <InputField label="Destreza" value={character.dexterity} onChange={(e) => handleChange('dexterity', e.target.value)} type="number" />
          <InputField label="Constitución" value={character.constitution} onChange={(e) => handleChange('constitution', e.target.value)} type="number" />
          <InputField label="Inteligencia" value={character.intelligence} onChange={(e) => handleChange('intelligence', e.target.value)} type="number" />
          <InputField label="Sabiduría" value={character.wisdom} onChange={(e) => handleChange('wisdom', e.target.value)} type="number" />
          <InputField label="Carisma" value={character.charisma} onChange={(e) => handleChange('charisma', e.target.value)} type="number" />
        </div>
      </motion.div>

      <motion.div variants={sectionVariants} className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">Combate y Defensa</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <InputField label="Puntos de Vida" value={character.hp} onChange={(e) => handleChange('hp', e.target.value)} type="number" />
          <InputField label="Clase de Armadura" value={character.ac} onChange={(e) => handleChange('ac', e.target.value)} type="number" />
          <InputField label="Velocidad" value={character.speed} onChange={(e) => handleChange('speed', e.target.value)} type="number" />
          <InputField label="Iniciativa" value={character.initiative} onChange={(e) => handleChange('initiative', e.target.value)} type="number" />
        </div>
      </motion.div>

      <motion.div variants={sectionVariants} className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">Detalles del Personaje</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextAreaField label="Habilidades" value={character.skills} onChange={(e) => handleChange('skills', e.target.value)} />
          <TextAreaField label="Equipo" value={character.equipment} onChange={(e) => handleChange('equipment', e.target.value)} />
          <TextAreaField label="Habilidades Especiales" value={character.abilities} onChange={(e) => handleChange('abilities', e.target.value)} />
          <TextAreaField label="Notas del Jugador" value={character.notes} onChange={(e) => handleChange('notes', e.target.value)} />
        </div>
      </motion.div>

      <motion.div variants={sectionVariants} className="text-center mt-8">
        <motion.button
          onClick={() => alert('¡Personaje guardado! (En tu imaginación, por supuesto, no hay base de datos aquí)')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Guardar Personaje
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default CharacterSheet;