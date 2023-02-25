import qrng
import os

# pip3 install qrng qiskit
# needs python 3.10+

# if you see output like "ibmq_london is not available. Backend is set to qasm_simulator."
# go to https://quantum-computing.ibm.com/services/resources and find one with status=Online and Plan=open

# Check your jobs at: https://quantum-computing.ibm.com/jobs

with open(os.path.expanduser('~/.ibmq-token')) as tokenf:
    token = tokenf.read()

qrng.set_provider_as_IBMQ(token)
qrng.set_backend('ibmq_lima')
print(qrng.get_random_int32())
