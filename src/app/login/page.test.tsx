/// <reference types="@testing-library/jest-dom" />
"use client";
import { useState } from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './page';

describe('LoginPage', () => {
  it('renderiza el título y los campos de login', () => {
    render(<LoginPage />);
    expect(screen.getByText('SalonBooker')).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('permite escribir en los campos de email y contraseña', async () => {
    render(<LoginPage />);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);

    await userEvent.type(emailInput, 'admin@salonbooker.com');
    await userEvent.type(passwordInput, 'admin123');

    expect(emailInput).toHaveValue('admin@salonbooker.com');
    expect(passwordInput).toHaveValue('admin123');
  });

  it('muestra y oculta la contraseña al hacer click en el icono', () => {
    render(<LoginPage />);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const toggleButton = screen.getAllByRole('button')[0]; 
    // Por defecto debe ser tipo password
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click para mostrar
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Click para ocultar
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});