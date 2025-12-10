import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// --- Interfaces para los datos del presupuesto ---
interface ServicioPdf {
  cantidadM2: number;
  unidadDeMedida: 'm2' | 'ml';
  tipoServicio: string;
  tipoSuperficie: string;
  marcaModelo: string;
  precioUnitario: number;
  importe: number;
  nombre: string; // Nuevo campo para la descripción descriptiva
}

interface AreaPdf {
  nombre: string;
  servicios: ServicioPdf[];
}

interface PresupuestoCompleto {
  id: number;
  createdAt: string;
  clienteNombre: string;
  clienteDireccion: string;
  subtotal: number;
  impuestos: number;
  total: number;
  areas: AreaPdf[];
}

// --- Registro de Fuentes ---
Font.register({ 
  family: 'Roboto', 
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
  ]
});

// --- Estilos ---
const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Roboto', fontSize: 9, color: '#333' },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 2, color: '#000' },
  headerSection: { marginBottom: 15, borderBottom: '1px solid #ccc', paddingBottom: 5 },
  companyName: { fontSize: 18, fontWeight: 'bold', marginBottom: 5, color: '#000' },
  companyInfo: { fontSize: 8, lineHeight: 1.5 },
  quoteDetails: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  quoteBox: { width: '45%', border: '1px solid #ddd', padding: 5, backgroundColor: '#f7f7f7' },
  quoteLabel: { fontSize: 8, fontWeight: 'bold', color: '#666' },
  quoteValue: { fontSize: 10, color: '#000' },
  clientSection: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, fontSize: 9 },
  clientBox: { width: '48%' },
  clientLabel: { fontWeight: 'bold', marginBottom: 2, marginTop: 5, borderBottom: '1px solid #ccc', paddingBottom: 2 },
  clientText: { fontSize: 9, marginBottom: 2 },
  table: { width: '100%', marginBottom: 10, display: "flex", flexDirection: "column" },
  tableRow: { flexDirection: 'row' },
  tableHeader: { backgroundColor: '#eee', fontWeight: 'bold', fontSize: 9, border: '1px solid #ccc' },
  tableCell: { padding: 4, fontSize: 8, borderBottom: '1px solid #eee' },
  colCantidad: { width: '10%', textAlign: 'center' },
  colClave: { width: '15%', textAlign: 'center' },
  colDescripcion: { width: '40%', textAlign: 'left' },
  colPU: { width: '15%', textAlign: 'right' },
  colImporte: { width: '20%', textAlign: 'right' },
  notes: { fontSize: 8, marginTop: 15, marginBottom: 15, borderTop: '1px solid #ccc', paddingTop: 5 },
  subtotalSection: { width: '40%', marginLeft: 'auto' },
  subtotalRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 4, borderBottom: '1px solid #eee' },
  subtotalLabel: { fontWeight: 'bold', fontSize: 9 },
  subtotalValue: { fontSize: 9, textAlign: 'right' },
  totalRow: { backgroundColor: '#eee', fontWeight: 'bold' },
});

// --- Helpers ---
const formatCurrency = (value: number) => `$${(value || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('es-MX');

// --- Componente del Documento PDF ---
const PdfPresupuesto = ({ presupuesto }: { presupuesto: PresupuestoCompleto }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* --- SECCIÓN EMPRESA Y FECHA --- */}
      <View style={styles.headerSection}>
        <Text style={styles.companyName}>Star Color's</Text>
        <Text style={styles.companyInfo}>JOSEPH ARIEL MARTINEZ SALGADO - R.F.C.: MASJ920711KE4</Text>
        <Text style={styles.companyInfo}>Calle: Mariana Rodriguez de lazarin No. 208, Col. Burocrata, CP: 76070, Queretaro, Queretaro, Mexico</Text>
      </View>

      {/* --- SECCIÓN COTIZACIÓN Y FECHA --- */}
      <View style={styles.quoteDetails}>
        <View><Text style={styles.title}>COTIZACIÓN</Text></View>
        <View style={styles.quoteBox}>
          <Text style={styles.quoteLabel}>COTIZACIÓN NO.</Text>
          <Text style={styles.quoteValue}>{presupuesto.id.toString().padStart(6, '0')}</Text>
          <Text style={styles.quoteLabel}>FECHA</Text>
          <Text style={styles.quoteValue}>{formatDate(presupuesto.createdAt)}</Text>
        </View>
      </View>

      {/* --- SECCIÓN CLIENTE --- */}
      <View style={styles.clientSection}>
        <View style={styles.clientBox}>
          <Text style={styles.clientLabel}>Cliente:</Text>
          <Text style={styles.clientText}>{presupuesto.clienteNombre}</Text>
          <Text style={styles.clientText}>{presupuesto.clienteDireccion}</Text>
        </View>
      </View>

      {/* --- TABLA DE ARTÍCULOS --- */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.colCantidad]}>CANT</Text>
          <Text style={[styles.tableCell, styles.colClave]}>CLAVE</Text>
          <Text style={[styles.tableCell, styles.colDescripcion]}>DESCRIPCIÓN</Text>
          <Text style={[styles.tableCell, styles.colPU]}>P/U</Text>
          <Text style={[styles.tableCell, styles.colImporte]}>IMPORTE</Text>
        </View>
        {presupuesto.areas.map((area) => (
          <React.Fragment key={area.nombre}>
            <View style={styles.tableRow}><Text style={[styles.tableCell, {width: '100%', fontWeight: 'bold'}]}>Área: {area.nombre}</Text></View>
            {area.servicios.map((servicio, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={[styles.tableCell, styles.colCantidad]}>{`${servicio.cantidadM2} ${servicio.unidadDeMedida}`}</Text>
                <Text style={[styles.tableCell, styles.colClave]}>{servicio.marcaModelo}</Text>
                <Text style={[styles.tableCell, styles.colDescripcion]}>{servicio.nombre}</Text>
                <Text style={[styles.tableCell, styles.colPU]}>{formatCurrency(servicio.precioUnitario)}</Text>
                <Text style={[styles.tableCell, styles.colImporte]}>{formatCurrency(servicio.importe)}</Text>
              </View>
            ))}
          </React.Fragment>
        ))}
      </View>

      {/* --- SECCIÓN DE TOTALES --- */}
      <View style={styles.subtotalSection}>
        <View style={styles.subtotalRow}>
          <Text style={styles.subtotalLabel}>Subtotal</Text>
          <Text style={styles.subtotalValue}>{formatCurrency(presupuesto.subtotal)}</Text>
        </View>
        <View style={styles.subtotalRow}>
          <Text style={styles.subtotalLabel}>I.V.A.</Text>
          <Text style={styles.subtotalValue}>{formatCurrency(presupuesto.impuestos)}</Text>
        </View>
        <View style={[styles.subtotalRow, styles.totalRow]}>
          <Text style={styles.subtotalLabel}>Total</Text>
          <Text style={[styles.subtotalValue, { fontSize: 11 }]}>{formatCurrency(presupuesto.total)}</Text>
        </View>
      </View>

    </Page>
  </Document>
);

export default PdfPresupuesto;
