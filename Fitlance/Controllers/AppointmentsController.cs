﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

using Fitlance.Data;
using Fitlance.Entities;

namespace Fitlance.Controllers;
[ApiController]
[Authorize]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly FitlanceContext _context;

    public AppointmentsController(FitlanceContext context)
    {
        _context = context;
    }

    [Authorize(Policy = "UserRights")]
    [HttpGet]
    [Route("GetUserAppointments/{id}")]
    [ProducesResponseType(typeof(Array), 200)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IEnumerable<Appointment>>> GetUserAppointments(string? id)
    {
        var appointments = await _context.Appointments.Where(a => a.ClientId == id).ToListAsync();

        if (appointments == null)
        {
            return NotFound();
        }

        return Ok(appointments);
    }

    [Authorize(Policy = "TrainerRights")]
    [HttpGet]
    [Route("GetTrainerAppointments/{id}")]
    [ProducesResponseType(typeof(Array), 200)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IEnumerable<Appointment>>> GetTrainerAppointments(string id)
    {
        var appointments = await _context.Appointments.Where(a => a.TrainerId == id).ToListAsync();

        if (appointments == null)
        {
            return NotFound();
        }

        return Ok(appointments);
    }

    [Authorize(Policy = "UserRights")]
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(object), 200)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Appointment>> GetAppointment(int id)
    {
        var appointment = await _context.Appointments.FindAsync(id);

        if (appointment == null)
        {
            return NotFound();
        }

        return Ok(appointment);
    }

    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [Authorize(Policy = "UserRights")]
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(object), 200)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> PutAppointment(int id, [FromBody] Appointment appointment)
    {
        try
        {
            var DbAppointment = await _context.Appointments.FindAsync(id);

            if (DbAppointment == null)
            {
                return NotFound("Appointment Not Found");
            }

            DbAppointment.City = appointment.City;
            DbAppointment.Country = appointment.Country;
            DbAppointment.State = appointment.State;
            DbAppointment.StreetAddress = appointment.StreetAddress;
            DbAppointment.PostalCode = appointment.PostalCode; 
            DbAppointment.Latitude = appointment.Latitude;
            DbAppointment.Longitude = appointment.Longitude;
            DbAppointment.StartTimeUtc = appointment.StartTimeUtc;
            DbAppointment.EndTimeUtc = appointment.EndTimeUtc;
            DbAppointment.UpdateTimeUtc = DateTime.UtcNow;

            _context.Entry(DbAppointment).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return Ok(DbAppointment);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!AppointmentExists(id))
            {
                return BadRequest("Bad Request");
            }
            else
            {
                throw;
            }
        }
    }

    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [Authorize(Policy = "UserRights")]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<Appointment>> PostAppointment(Appointment appointment)
    {
        _context.Appointments.Add(appointment);

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAppointment), new { id = appointment.Id }, appointment);
    }

    [Authorize(Policy = "UserRights")]
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteAppointment(int id)
    {
        var appointment = await _context.Appointments.FindAsync(id);

        if (appointment == null)
        {
            return NotFound();
        }

        _context.Appointments.Remove(appointment);

        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool AppointmentExists(int id)
    {
        return _context.Appointments.Any(e => e.Id == id);
    }
}