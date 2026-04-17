const pool = require('../config/db');

const getMunicipalities = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id_municipio, nombre_municipio FROM municipio ORDER BY nombre_municipio');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener municipios' });
  }
};

const getDonationTypes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id_tipo_donacion, nombre_tipo FROM tipo_donacion');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tipos de donación' });
  }
};

const getEducationalLevels = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id_nivel, nombre_nivel FROM nivel_educativo');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener niveles educativos' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const [totalSchools] = await pool.query('SELECT COUNT(*) as total FROM escuela');
    const [totalNeeds] = await pool.query('SELECT COUNT(*) as total FROM escuela_necesidad');
    const [totalRequests] = await pool.query('SELECT COUNT(*) as total FROM solicitud_apoyo');
    const [avgProgress] = await pool.query('SELECT AVG(progreso_financiamiento) as promedio FROM escuela');
    const [conditions] = await pool.query(`
      SELECT nivel_condicion, COUNT(*) as count
      FROM escuela
      GROUP BY nivel_condicion
    `);
    const distribution = {};
    conditions.forEach(c => { distribution[c.nivel_condicion] = c.count; });

    res.json({
      totalEscuelas: totalSchools[0].total,
      necesidadesPendientes: totalNeeds[0].total,
      solicitudesRecibidas: totalRequests[0].total,
      progresoPromedio: Math.round(avgProgress[0].promedio || 0),
      distribucionCondiciones: distribution,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
};

const getGlobalProgress = async (req, res) => {
  try {
    // Meta: todas las escuelas en nivel 'Básico' o superior
    const [total] = await pool.query('SELECT COUNT(*) as total FROM escuela');
    const [basicoSuperior] = await pool.query(
      `SELECT COUNT(*) as count FROM escuela WHERE nivel_condicion IN ('Básico', 'Medio', 'Alto', 'Ideal')`
    );
    const current = basicoSuperior[0].count;
    const goal = total[0].total;
    const percentage = goal > 0 ? Math.round((current / goal) * 100) : 0;
    // Convertir a "corazones" (por ejemplo, cada escuela = 100 corazones, o usar una escala fija)
    const heartCurrent = current * 100;
    const heartGoal = goal * 100;
    res.json({
      current: heartCurrent,
      goal: heartGoal,
      percentage,
      escuelasActuales: current,
      escuelasMeta: goal,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener progreso global' });
  }
};

module.exports = {
  getMunicipalities,
  getDonationTypes,
  getEducationalLevels,
  getDashboardStats,
  getGlobalProgress,
};