const User = require('../models/User');
const Event = require('../models/Event');
const Report = require('../models/Report');

async function getDashboard(req, res) {
  try {
    const [totalUsers, activeEvents, blockedUsers, totalEvents] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments({ status: 'active' }),
      User.countDocuments({ isBlocked: true }),
      Event.countDocuments()
    ]);

    const upcomingEventsRaw = await Event.find({
      startDate: { $ne: null, $gte: new Date() }
    })
      .sort({ startDate: 1 })
      .limit(5)
      .select('title startDate status');

    const upcomingEvents = upcomingEventsRaw.map((event) => ({
      id: event._id,
      name: event.title,
      date: event.startDate,
      status: event.status,
      enrolled: 0
    }));

    return res.status(200).json({
      stats: {
        totalUsers,
        activeEvents,
        pendingModeration: blockedUsers,
        totalRegistrations: totalEvents
      },
      upcomingEvents
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener dashboard de admin' });
  }
}

async function getUsers(req, res) {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select('name email role isBlocked createdAt');

    const mappedUsers = users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt
    }));

    return res.status(200).json({ users: mappedUsers });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener usuarios de admin' });
  }
}

async function getEvents(req, res) {
  try {
    const events = await Event.find()
      .sort({ startDate: -1 })
      .select('title description category startDate status enrolled');

    const mappedEvents = events.map((event) => ({
      id: event._id,
      name: event.title,
      description: event.description,
      category: event.category || 'General',
      date: event.startDate,
      status: event.status === 'active' ? 'active' : 'pending',
      enrolled: event.enrolled || 0
    }));

    return res.status(200).json({ events: mappedEvents });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener eventos de admin' });
  }
}

async function getReportsSummary(req, res) {
  try {
    const [totalReports, userReports, contentReports, eventReports] = await Promise.all([
      Report.countDocuments(),
      Report.countDocuments({ category: 'Usuarios' }),
      Report.countDocuments({ category: 'Contenido' }),
      Report.countDocuments({ category: 'Eventos' })
    ]);

    return res.status(200).json({
      summary: {
        totalReports,
        contentReports,
        userReports,
        eventReports
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener resumen de reportes' });
  }
}

async function getReports(req, res) {
  try {
    const { category } = req.query;

    let filter = {};
    if (category && ['Contenido', 'Usuarios', 'Eventos'].includes(category)) {
      filter.category = category;
    }

    const reports = await Report.find(filter)
      .populate('involvedUser', 'name username')
      .populate('reportedBy', 'name username')
      .sort({ createdAt: -1 })
      .select('type involvedUser reportedBy description reason category status createdAt');

    const mappedReports = reports.map((report) => ({
      id: report._id,
      type: mapReportType(report.type),
      involvedUser: report.involvedUser?.name || 'Usuario desconocido',
      involvedUsername: report.involvedUser?.username || 'unknown',
      description: report.description,
      reportedBy: report.reportedBy?.name || 'Anónimo',
      reason: mapReportReason(report.reason),
      date: new Date(report.createdAt).toLocaleDateString('es-ES'),
      category: report.category,
      status: report.status
    }));

    return res.status(200).json({ reports: mappedReports });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener reportes de admin' });
  }
}

function mapReportType(type) {
  const typeMap = {
    'comment': 'Comentario inapropiado',
    'message': 'Mensaje privado',
    'user': 'Actividad sospechosa',
    'event': 'Posible SPAM'
  };
  return typeMap[type] || type;
}

function mapReportReason(reason) {
  const reasonMap = {
    'spam': 'Spam',
    'offensive_content': 'Contenido ofensivo',
    'inappropriate': 'Contenido inapropiado',
    'needs_urgent_review': 'Necesita revisión urgente',
    'other': 'Otro'
  };
  return reasonMap[reason] || reason;
}

module.exports = {
  getDashboard,
  getUsers,
  getEvents,
  getReportsSummary,
  getReports
};
