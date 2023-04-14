import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import type { IParsedRequest } from 'request-shared';

import { paymentStatus, paymentStatusColors } from '@/utils/constant';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: '10px',
  },
  title: {
    alignItems: 'flex-end',
    marginBottom: 10,
    marginTop: 20,
  },
  headerRow: {
    marginBottom: 4,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  receiptHeader: {
    marginBottom: 20,
  },
  headerBodyText: {
    marginBottom: 4,
    color: '#656565',
  },
  status: {
    borderRadius: 4,
    minWidth: 74,
    height: 32,
    padding: '8px 24px',
    color: '#000',
    fontWeight: 600,
  },
  caption: {
    marginBottom: 4,
    fontWeight: 600,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 80,
  },
  contentHeader: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomColor: '#050B20',
    borderBottomStyle: 'solid',
    borderBottomWidth: 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentRow: {
    backgroundColor: 'white',
    padding: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#E4E4E4',
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
  },
  footer: {
    alignItems: 'center',
    color: '#656565',
  },
  testNetwork: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '110%',
  },
  testNetworkBanner: {
    height: 4,
    backgroundColor: '#FFB95F',
    width: '100%',
  },
  testNetworkText: {
    backgroundColor: '#FFB95F',
    color: 'white',
    height: 40,
    width: 180,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const PdfReceipt = ({
  request,
  transactionUrl,
}: {
  request: IParsedRequest;
  transactionUrl?: string;
}) => {
  const amountAndCurrency = `${request.amount.toString()} ${
    request.currencySymbol
  }`;
  if (!['paid', 'overpaid', 'canceled'].includes(request.status))
    throw new Error(
      `Cannot download a receipt when request is ${request.status}`
    );
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {request.network === 'goerli' && (
          <View style={styles.testNetwork}>
            <View style={styles.testNetworkBanner} />
            <View style={styles.testNetworkText}>
              <Text>Goerli Test Network</Text>
            </View>
          </View>
        )}
        <View style={styles.title}>
          <Text>Receipt</Text>
        </View>
        <View style={{ ...styles.headerRow, ...styles.receiptHeader }}>
          <View></View>
          <View
            style={{
              alignItems: 'flex-end',
            }}
          >
            <Text style={styles.headerBodyText}>
              Issued on <Text>{request.createdDate.toDateString()}</Text>
            </Text>
            <Text
              style={[
                styles.headerBodyText,
                {
                  fontWeight: 600,
                  color: '#050B20',
                },
              ]}
            >
              Paid on <Text>{request.paidDate?.toDateString()}</Text>
            </Text>
            <Text
              style={{
                ...styles.status,
                backgroundColor: paymentStatusColors[request.status],
              }}
            >
              {paymentStatus[request.status]}
            </Text>
          </View>
        </View>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.caption}>From</Text>
            <Text style={styles.headerBodyText}>{request.payee}</Text>
          </View>
          <View
            style={{
              alignItems: 'flex-end',
            }}
          ></View>
        </View>

        <View style={styles.headerRow}>
          <View>
            <Text style={styles.caption}>Billed to</Text>

            <Text style={styles.headerBodyText}>{request.payer || 'Open'}</Text>
          </View>
        </View>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.caption}>Paid by</Text>
            <Text style={styles.headerBodyText}>{request.paymentFrom}</Text>
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.contentHeader}>
            <Text style={{ flex: 5 / 10 }}>Description</Text>
            <Text style={{ flex: 1 / 10 }}>Qty</Text>
            <Text style={{ flex: 2 / 10 }}>Unit price</Text>
            <Text style={{ flex: 2 / 10 }}>Amount</Text>
          </View>
          <View style={styles.contentRow}>
            <Text style={{ flex: 5 / 10 }}></Text>
            <Text style={{ flex: 1 / 10 }}>1</Text>
            <Text style={{ flex: 2 / 10 }}>{amountAndCurrency}</Text>
            <Text style={{ flex: 2 / 10 }}>{amountAndCurrency}</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ flex: 6 / 10 }}></Text>
            <View style={[styles.contentRow, { flex: 4 / 10 }]}>
              <Text style={{ flex: 1 / 2 }}>Subtotal</Text>
              <Text style={{ flex: 1 / 2 }}>{amountAndCurrency}</Text>
            </View>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ flex: 6 / 10 }}></Text>
            <View
              style={[styles.contentRow, { flex: 4 / 10, fontWeight: 600 }]}
            >
              <Text style={{ flex: 1 / 2 }}>Paid</Text>
              <Text style={{ flex: 1 / 2 }}>{amountAndCurrency}</Text>
            </View>
          </View>
        </View>
        {request.reason ? (
          <View style={{ marginTop: 40 }}>
            <Text style={styles.caption}>Reason</Text>
            <Text style={styles.headerBodyText}>{request.reason}</Text>
          </View>
        ) : null}
        <View style={{ flex: 1 }} />
        <View style={styles.footer}>
          {transactionUrl && (
            <Text style={{ marginTop: 4 }}>
              View your transaction on Etherscan{' '}
              <Link
                src={transactionUrl}
                style={{ textDecoration: 'none', color: '#00CC8E' }}
              >
                here
              </Link>
              .
            </Text>
          )}
        </View>
      </Page>
    </Document>
  );
};
