ORM Migrations and Relations Solutions

address.hasOne(models.student, {
      foreignKey: 'address_id',
      as: 'student',      
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    })

Course.belongsToMany(models.teacher, { 
    through: 'courseTeacher',
    foreignKey: 'course_id', as: 'teachers'
    });

Enrollment.belongsTo(models.students,{
       foreignKey: 'student_id', as: 'student'
       });
      Enrollment.belongsTo(models.course, {
       foreignKey: 'course_id', as: 'course' });

Students.belongsTo(models.address, { 
      foreignKey: 'address_id', as: 'address' 
    });

Teacher.belongsToMany(models.course, { 
     through: 'courseTeachers',
     foreignKey: 'teacher_id',
     as: 'courses' });

//hooks
hooks: {
      beforeCreate: async (user, options) => {
      if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
     }
      }}

hooks: {
      beforeCreate: (enrollment, options) => {
      if (!enrollment.enrollmentDate) {
        enrollment.enrollmentDate = new Date();
      }
    }
  }


